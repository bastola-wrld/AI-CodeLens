import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    connect(url: string, token: string) {
        this.socket = io(`${url}/ai`, {
            auth: { token },
        });

        this.socket.on('connect_error', (err: any) => {
            console.error('Socket connection error:', err);
        });
    }

    subscribe(conversationId: string, onToken: (data: any) => void) {
        if (!this.socket) return;
        this.socket.emit('subscribe', { conversationId });
        this.socket.on('token', onToken);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
