import { Injectable } from '@nestjs/common'
import { store } from '../common/utils/inmemory-store'

@Injectable()
export class RunsService {
  get(id: string) {
    const run = store.get(id)
    if (!run) return null
    return run
  }

  list() {
    return store.list()
  }
}
