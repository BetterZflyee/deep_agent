import { Module } from '@nestjs/common'
import { AgentsController } from './agents/agents.controller'
import { AgentsService } from './agents/agents.service'
import { RunsController } from './runs/runs.controller'
import { RunsService } from './runs/runs.service'

@Module({
  controllers: [AgentsController, RunsController],
  providers: [AgentsService, RunsService]
})
export class AppModule {}
