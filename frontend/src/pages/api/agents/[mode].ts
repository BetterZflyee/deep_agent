import type { NextApiRequest, NextApiResponse } from 'next'

type Mode = 'strategy' | 'market' | 'marketing'

const COZE_BASE_URL = process.env.COZE_BASE_URL || 'https://api.coze.com'
const COZE_API_KEY = process.env.COZE_API_KEY || ''

const AGENT_IDS: Record<Mode, string | undefined> = {
  strategy: process.env.COZE_AGENT_ID_STRATEGY,
  market: process.env.COZE_AGENT_ID_MARKET,
  marketing: process.env.COZE_AGENT_ID_MARKETING,
}

async function callCoze(mode: Mode, inputData: any) {
  const agentId = AGENT_IDS[mode]
  if (!COZE_API_KEY) throw new Error('COZE_API_KEY 未配置')
  if (!agentId) throw new Error(`Agent ID 未配置: ${mode}`)
    
  const { input, conversation_id, history } = inputData
  
  console.log(`[CozeAPI] Calling ${mode} (BotID: ${agentId})`)
  console.log(`[CozeAPI] Conversation ID: ${conversation_id}`)

  // Construct additional_messages from history + current input
  // Note: Coze v3 Chat API additional_messages expects:
  // [{role: 'user', content: ..., content_type: 'text'}, {role: 'assistant', ...}]
  // We should append the current input as the last message.
  
  let additional_messages = []
  if (Array.isArray(history)) {
    // Map frontend 'agent' role to Coze 'assistant' role
    additional_messages = history.map((msg: any) => ({
      role: msg.role === 'agent' ? 'assistant' : 'user',
      content: msg.content,
      content_type: 'text'
    }))
  }
  
  // Append current user input
  additional_messages.push({
    role: 'user',
    content: input,
    content_type: 'text'
  })
  
  // Use Chat API (v3) for conversation support
  const res = await fetch(`${COZE_BASE_URL}/v3/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COZE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: agentId,
      user_id: conversation_id || 'user_default', // Use conversation_id as user_id for session isolation
      additional_messages: additional_messages,
      conversation_id: conversation_id,
      stream: false,
      auto_save_history: true
    }),
  })
  
  if (!res.ok) {
     const text = await res.text()
     console.error(`[CozeAPI] Error: ${res.status} ${text}`)
     throw new Error(text || 'COZE API 调用失败')
  }
  
  const json = await res.json()
  console.log(`[CozeAPI] Success. Conversation ID: ${json.data?.conversation_id}`)
  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: { code: 'method_not_allowed', message: '仅支持 POST' } })
    return
  }
  const mode = String(req.query.mode || '') as Mode
  if (!['strategy', 'market', 'marketing'].includes(mode)) {
    res.status(400).json({ ok: false, error: { code: 'invalid_mode', message: '无效的 Agent 模式' } })
    return
  }
  try {
    const body = req.body || {}
    const data = await callCoze(mode, body)
    res.status(200).json({ ok: true, data })
  } catch (e: any) {
    res.status(200).json({ ok: false, error: { code: 'coze_error', message: e?.message || '调用失败' } })
  }
}

