export const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export async function createRun(agentId: string, agentMode: 'strategy' | 'market' | 'marketing', input: Record<string, unknown>) {
  const res = await fetch(`${BACKEND}/agents/${agentId}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentMode, input })
  })
  if (!res.ok) throw new Error(`Failed to create run: ${res.status}`)
  return (await res.json()) as { run_id: string }
}

export async function getRun(id: string) {
  const res = await fetch(`${BACKEND}/runs/${id}`)
  if (!res.ok) throw new Error(`Failed to get run: ${res.status}`)
  return await res.json()
}

export async function listRuns() {
  const res = await fetch(`${BACKEND}/runs`)
  if (!res.ok) throw new Error(`Failed to list runs: ${res.status}`)
  return await res.json()
}
