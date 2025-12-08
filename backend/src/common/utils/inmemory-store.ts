import { RunRecord } from '../entities/run.entity'

export class InMemoryStore {
  private runs = new Map<string, RunRecord>()

  upsert(run: RunRecord) {
    this.runs.set(run.id, run)
  }

  get(id: string) {
    return this.runs.get(id)
  }

  list() {
    return Array.from(this.runs.values()).sort((a, b) => b.createdAt - a.createdAt)
  }
}

export const store = new InMemoryStore()
