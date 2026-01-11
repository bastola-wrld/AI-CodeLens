import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    title: string;

    @ManyToOne(() => User, (user) => user.conversations)
    user: User;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];

    @CreateDateColumn()
    created_at: Date;
}
