import { Module, Global } from '@nestjs/common';
import { AiService } from './ai.service';
import { EngineManager } from './adapters';

@Global()
@Module({
  providers: [AiService, EngineManager],
  exports: [AiService, EngineManager],
})
export class AiModule {}
