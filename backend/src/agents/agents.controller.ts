import { Body, Controller, Param, Post } from '@nestjs/common'
import { AgentsService } from './agents.service'
import { TriggerRunDto } from '../common/dto/run.dto'

@Controller('agents')
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @Post(':id/runs')
  createRun(@Param('id') id: string, @Body() body: TriggerRunDto) {
    const runId = this.agents.triggerRun(id, body.agentMode, body.input)
    return { run_id: runId }
  }
}
