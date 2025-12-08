import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  const port = Number(process.env.PORT || 4000)
  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`)
}

bootstrap()
