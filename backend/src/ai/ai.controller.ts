import { Controller, Post, Body, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiGateway } from './ai.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageRole } from '../messages/entities/message.entity';

import { AiReviewDto } from './dto/ai-review.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(
        private aiService: AiService,
        private aiGateway: AiGateway,
        private conversationsService: ConversationsService,
    ) { }

    @Post('review')
    async review(@Body() body: AiReviewDto, @Request() req) {
        const { conversationId, code, language } = body;

        // Mentor Note: Simple prompt injection protection
        // This is a basic check. In production, we'd use a more sophisticated 
        // adversarial detector or a specialized AI guardrail.
        const injectionPatterns = [
            'ignore all previous instructions',
            'system bypass',
            'internal prompt',
            'you are now',
        ];

        if (injectionPatterns.some(p => code.toLowerCase().includes(p))) {
            throw new BadRequestException('Security violation: Potential prompt injection detected.');
        }

        const conversation = await this.conversationsService.findOne(conversationId);

        const lang = language || 'unknown';

        // 1. Save user message
        const userMessage = await this.conversationsService.addMessage(conversationId, MessageRole.USER, `Please review this ${lang} code.`);
        await this.conversationsService.addSnippet(userMessage.id, code, lang);

        // 2. Prepare AI response
        const assistantMessage = await this.conversationsService.addMessage(conversationId, MessageRole.ASSISTANT, '');

        // 3. Start AI Stream (Async)
        this.processAiStream(conversationId, assistantMessage.id, [
            { role: 'system', content: this.aiService.getSystemPrompt() },
            { role: 'user', content: this.aiService.getCodeReviewPrompt(code, lang) }
        ]);

        return { messageId: assistantMessage.id };
    }

    @Post('modify')
    async modify(@Body() body: { conversationId: string; code: string; instructions: string; language: string }, @Request() req) {
        const { conversationId, code, instructions, language } = body;
        const assistantMessage = await this.conversationsService.addMessage(conversationId, MessageRole.ASSISTANT, '');

        this.processAiStream(conversationId, assistantMessage.id, [
            { role: 'system', content: this.aiService.getSystemPrompt() },
            { role: 'user', content: this.aiService.getModifyCodePrompt(code, instructions, language) }
        ]);

        return { messageId: assistantMessage.id };
    }

    @Post('generate')
    async generate(@Body() body: { conversationId: string; prompt: string }, @Request() req) {
        const { conversationId, prompt } = body;
        const assistantMessage = await this.conversationsService.addMessage(conversationId, MessageRole.ASSISTANT, '');

        this.processAiStream(conversationId, assistantMessage.id, [
            { role: 'system', content: this.aiService.getSystemPrompt() },
            { role: 'user', content: this.aiService.getGenerateCodePrompt(prompt) }
        ]);

        return { messageId: assistantMessage.id };
    }

    private async processAiStream(conversationId: string, messageId: string, messages: any[]) {
        const stream = await this.aiService.createStreamingChatCompletion(messages);
        let fullContent = '';

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullContent += content;
                this.aiGateway.streamToken(conversationId, messageId, content);
            }
        }

        // Update final message in DB
        await this.conversationsService.updateMessageContent(messageId, fullContent);
        this.aiGateway.streamToken(conversationId, messageId, '', true);
    }
}
