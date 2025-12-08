export type RunStatus = 'queued' | 'running' | 'completed' | 'failed'

export interface RunRecord {
  id: string
  agentId: string
  agentMode: 'strategy' | 'market' | 'marketing'
  input: Record<string, unknown>
  status: RunStatus
  createdAt: number
  updatedAt: number
  error?: string
  output?: unknown
}
