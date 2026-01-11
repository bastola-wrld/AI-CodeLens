import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password_hash: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Conversation, (conversation) => conversation.user)
    conversations: Conversation[];
}
