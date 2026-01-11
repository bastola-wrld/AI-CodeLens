import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageRole } from '../messages/entities/message.entity';
import { CodeSnippet } from '../snippets/entities/snippet.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(CodeSnippet)
        private snippetRepository: Repository<CodeSnippet>,
    ) { }

    async create(user: User, title?: string): Promise<Conversation> {
        const conversation = this.conversationRepository.create({ user, title });
        return this.conversationRepository.save(conversation);
    }

    async findAllByUser(userId: string): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Conversation | null> {
        return this.conversationRepository.findOne({
            where: { id },
            relations: ['messages', 'messages.snippets'],
            order: { messages: { created_at: 'ASC' } },
        });
    }

    async addMessage(conversationId: string, role: MessageRole, content: string): Promise<Message> {
        const message = this.messageRepository.create({
            conversation: { id: conversationId },
            role,
            content,
        });
        return this.messageRepository.save(message);
    }

    async updateMessageContent(messageId: string, content: string): Promise<void> {
        await this.messageRepository.update(messageId, { content });
    }

    async addSnippet(messageId: string, content: string, language: string): Promise<CodeSnippet> {
        const snippet = this.snippetRepository.create({
            message: { id: messageId },
            content,
            language,
        });
        return this.snippetRepository.save(snippet);
    }
}
