import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateRunDto {
  @IsString()
  agentId!: string

  @IsEnum(['strategy', 'market', 'marketing'] as const)
  agentMode!: 'strategy' | 'market' | 'marketing'

  @IsObject()
  input!: Record<string, unknown>

  @IsOptional()
  @IsString()
  requestId?: string
}

export class TriggerRunDto {
  @IsEnum(['strategy', 'market', 'marketing'] as const)
  agentMode!: 'strategy' | 'market' | 'marketing'

  @IsObject()
  input!: Record<string, unknown>
}
