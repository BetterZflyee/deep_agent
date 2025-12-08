import { Injectable } from '@nestjs/common'
import { store } from '../common/utils/inmemory-store'
import { RunRecord } from '../common/entities/run.entity'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

@Injectable()
export class AgentsService {
  triggerRun(agentId: string, agentMode: 'strategy' | 'market' | 'marketing', input: Record<string, unknown>) {
    const id = uid()
    const now = Date.now()
    const run: RunRecord = {
      id,
      agentId,
      agentMode,
      input,
      status: 'queued',
      createdAt: now,
      updatedAt: now
    }
    store.upsert(run)
    setTimeout(() => this.execute(run.id), 50)
    return id
  }

  private async execute(runId: string) {
    const record = store.get(runId)
    if (!record) return
    record.status = 'running'
    record.updatedAt = Date.now()
    store.upsert(record)
    try {
      const simulated = await this.simulateAgent(record)
      record.status = 'completed'
      record.output = simulated
      record.updatedAt = Date.now()
      store.upsert(record)
    } catch (e) {
      record.status = 'failed'
      record.error = e instanceof Error ? e.message : String(e)
      record.updatedAt = Date.now()
      store.upsert(record)
    }
  }

  private async simulateAgent(record: RunRecord) {
    await new Promise((r) => setTimeout(r, 300))
    const base = {
      agentId: record.agentId,
      mode: record.agentMode,
      input: record.input,
      insights: [
        'Mock insight A',
        'Mock insight B'
      ],
      recommendations: [
        'Mock recommendation 1',
        'Mock recommendation 2'
      ]
    }
    return base
  }
}
