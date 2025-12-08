import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

const BASE_URL = process.env.COZE_CN_BASE_URL || 'https://api.coze.cn'
const API_KEY = process.env.COZE_CN_API_KEY || ''
const WORKFLOW_ID = process.env.COZE_STRATEGY_WORKFLOW_ID || ''

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
}

// 增强的流式解析器，支持标准 SSE 和 NDJSON
async function streamWorkflow(input: any) {
  const url = `${BASE_URL}/v1/workflow/stream_run`
  
  const body = {
    workflow_id: WORKFLOW_ID,
    parameters: input, 
  }

  console.log('[Strategy API] Requesting:', url, JSON.stringify(body))

  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[Strategy API] Error Response:', res.status, text)
    try {
      const json = JSON.parse(text)
      throw new Error(json.msg || json.error_message || text)
    } catch {
      throw new Error(text || `调用失败: ${res.status} ${res.statusText}`)
    }
  }

  const events: string[] = []
  const nodes: any[] = []
  let buffer = ''
  let currentEvent: string | null = null

  // 处理解析后的消息对象
  const processMessage = (eventType: string | null, data: any) => {
    console.log('[Strategy API] Process Message:', eventType, JSON.stringify(data))
    
    // 情况1: 消息内容直接在 data 中 (Coze 常见格式)
    if (data && typeof data === 'object') {
      // 如果 data 内部有 content，通常是文本消息
      if (data.content && typeof data.content === 'string') {
        events.push(data.content)
      }
      // 如果 data 内部有 message 字段
      else if (data.message && typeof data.message === 'string') {
        events.push(data.message)
      }
      
      // 收集调试信息
      nodes.push(data)
    }
    // 情况2: data 本身是字符串
    else if (typeof data === 'string') {
      events.push(data)
    }
  }

  const handleBuffer = (chunk: string) => {
    buffer += chunk
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() || ''
    
    for (const line of lines) {
      const s = line.trim()
      if (!s) continue
      
      // Debug log for raw lines
      // console.log('[Strategy API] Stream Line:', s)

      // 1. 处理 SSE 格式
      if (s.startsWith('event:')) {
        currentEvent = s.slice(6).trim()
      } else if (s.startsWith('data:')) {
        const dataStr = s.slice(5).trim()
        if (dataStr === '[DONE]') continue
        try {
          const data = JSON.parse(dataStr)
          processMessage(currentEvent, data)
        } catch {
          // 如果不是 JSON，直接作为字符串处理
          processMessage(currentEvent, dataStr)
        }
        // 重置 event，除非是连续数据（但在 Coze API 中通常每个 data 前都有 event 或默认 event）
        // 保持 currentEvent 直到下一个 event: 出现也是一种策略，但安全起见这里不强制重置，依靠 event: 覆盖
      } 
      // 2. 处理 NDJSON 格式 (整行是 JSON)
      else if (s.startsWith('{')) {
        try {
          const json = JSON.parse(s)
          // 尝试从 JSON 中提取 event 字段
          const evt = json.event || json.type || 'message'
          const data = json.data || json
          processMessage(evt, data)
        } catch {
           // 忽略非 JSON 行
        }
      }
    }
  }

  const responseBody: any = res.body
  const decoder = new TextDecoder()

  if (responseBody && typeof responseBody.getReader === 'function') {
    const reader = responseBody.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        handleBuffer(decoder.decode(value, { stream: true }))
      }
    } catch (e) {
      console.error('[Strategy API] Stream reading error:', e)
    }
  } else if (responseBody && typeof responseBody[Symbol.asyncIterator] === 'function') {
    try {
      for await (const chunk of responseBody) {
        const text = typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })
        handleBuffer(text)
      }
    } catch (e) {
      console.error('[Strategy API] AsyncIterator reading error:', e)
    }
  } else {
    const text = await res.text()
    handleBuffer(text)
  }
  
  console.log('[Strategy API] Stream finished. Events:', events.length, 'Nodes:', nodes.length)
  return { events, nodes }
}

// 简单的 IP 速率限制: 100次/分钟
const BUCKET: Record<string, { tokens: number; ts: number }> = {}
function allow(ip: string) {
  const now = Date.now()
  const entry = BUCKET[ip] || { tokens: 100, ts: now }
  const elapsed = (now - entry.ts) / 60000
  entry.tokens = Math.min(100, entry.tokens + elapsed * 100)
  entry.ts = now
  if (entry.tokens < 1) {
    BUCKET[ip] = entry
    return false
  }
  entry.tokens -= 1
  BUCKET[ip] = entry
  return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: { code: 'method_not_allowed', message: '仅支持 POST' } })
    return
  }

  if (!API_KEY || !WORKFLOW_ID) {
    res.status(200).json({ ok: false, error: { code: 'config_error', message: '缺少 COZE_CN_API_KEY 或 COZE_STRATEGY_WORKFLOW_ID' } })
    return
  }

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local'
  if (!allow(ip)) {
    res.status(429).json({ ok: false, error: { code: 'rate_limited', message: '超过速率限制(100次/分钟)' } })
    return
  }

  try {
    const input = (req.body && req.body.input) || {}
    console.log('[Strategy API] Received input:', JSON.stringify(input))
    
    const streamed = await streamWorkflow(input)
    
    res.status(200).json({ ok: true, data: streamed })
  } catch (e: any) {
    console.error('[Strategy API] Workflow Error:', e)
    res.status(200).json({ ok: false, error: { code: 'workflow_error', message: e.message || '调用失败' } })
  }
}
