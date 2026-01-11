import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { CodeSnippet } from '../../snippets/entities/snippet.entity';
import { AiReview } from '../../reviews/entities/review.entity';

export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 20 })
    role: MessageRole;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    conversation: Conversation;

    @OneToMany(() => CodeSnippet, (snippet) => snippet.message)
    snippets: CodeSnippet[];

    @OneToMany(() => AiReview, (review) => review.message)
    reviews: AiReview[];

    @CreateDateColumn()
    created_at: Date;
}
