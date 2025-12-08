import { Controller, Get, Param } from '@nestjs/common'
import { RunsService } from './runs.service'

@Controller('runs')
export class RunsController {
  constructor(private readonly runs: RunsService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    const run = this.runs.get(id)
    if (!run) return { error: 'not_found' }
    return run
  }

  @Get()
  list() {
    return this.runs.list()
  }
}
