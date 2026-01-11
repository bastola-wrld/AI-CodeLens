import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';

@Entity('code_snippets')
export class CodeSnippet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ nullable: true })
    language: string;

    @Column({ default: 1 })
    version: number;

    @ManyToOne(() => Message, (message) => message.snippets)
    message: Message;

    @CreateDateColumn()
    created_at: Date;
}
