import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { AiGateway } from './ai.gateway';
import { AiController } from './ai.controller';
import { ConversationsModule } from '../conversations/conversations.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [ConfigModule, forwardRef(() => ConversationsModule)],
  providers: [AiService, AiGateway],
  exports: [AiService, AiGateway],
  controllers: [AiController],
})
export class AiModule { }
