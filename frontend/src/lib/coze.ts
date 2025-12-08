export type AgentMode = 'strategy' | 'market' | 'marketing'

export interface CozeResult<T = any> {
  ok: boolean
  data?: T
  error?: { code: string; message: string }
}

export async function callAgent(mode: AgentMode, input: any, signal?: AbortSignal): Promise<CozeResult> {
  const res = await fetch(`/api/agents/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    signal,
  })
  const json = await res.json()
  return json
}

export async function callStrategyWorkflow(input: any, opts?: { stream?: boolean; signal?: AbortSignal }): Promise<CozeResult> {
  const url = `/api/workflows/strategy${opts?.stream ? '?stream=1' : ''}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    signal: opts?.signal,
  })
  const json = await res.json()
  return json
}
