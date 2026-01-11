import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';

@Entity('ai_reviews')
export class AiReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'simple-json' })
    feedback: any;

    @ManyToOne(() => Message, (message) => message.reviews)
    message: Message;

    @CreateDateColumn()
    created_at: Date;
}
