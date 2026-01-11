import { useState, useEffect } from 'react';
import { socketService } from '../services/socket.service';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function useStreamingChat(conversationId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        if (!conversationId) return;

        socketService.subscribe(conversationId, (data) => {
            const { messageId, content, isFinal } = data;

            setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.id === messageId) {
                    return [
                        ...prev.slice(0, -1),
                        { ...lastMessage, content: lastMessage.content + content }
                    ];
                } else {
                    return [...prev, { id: messageId, role: 'assistant', content }];
                }
            });

            if (isFinal) {
                setIsStreaming(false);
            }
        });

        return () => {
            // Unsubscribe logic if needed
        };
    }, [conversationId]);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    return { messages, setMessages, isStreaming, setIsStreaming, addMessage };
}
