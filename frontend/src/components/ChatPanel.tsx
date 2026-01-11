import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CornerDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { socketService } from '../services/socket.service';

interface Message {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatPanelProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    onReview?: (handleReviewFn: () => void) => void;
    onModify?: (handleModifyFn: () => void) => void;
    onGenerate?: (handleGenerateFn: () => void) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ code, setCode, language, onReview, onModify, onGenerate }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);

    useEffect(() => {
        const handleToken = (data: { content: string; isFinal: boolean }) => {
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                    const newContent = last.content + data.content;

                    // If streaming is finished, try to extract code
                    if (data.isFinal) {
                        const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
                        const matches = [...newContent.matchAll(codeBlockRegex)];
                        if (matches.length > 0) {
                            // Take the last code block (usually the latest version)
                            const extractedCode = matches[matches.length - 1][1];
                            setCode(extractedCode);
                        }
                    }

                    return [...prev.slice(0, -1), { ...last, content: newContent }];
                }
                return [...prev, { role: 'assistant', content: data.content }];
            });
            if (data.isFinal) setIsStreaming(false);
        };

        const fetchConversation = async () => {
            try {
                const res = await axios.get('/api/conversations');
                if (res.data.length > 0) {
                    setConversationId(res.data[0].id);
                    const detail = await axios.get(`/api/conversations/${res.data[0].id}`);
                    setMessages(detail.data.messages);
                    socketService.subscribe(res.data[0].id, handleToken);
                } else {
                    const newConv = await axios.post('/api/conversations', { title: 'New Workspace' });
                    setConversationId(newConv.data.id);
                    socketService.subscribe(newConv.data.id, handleToken);
                }
            } catch (err) {
                console.error('Failed to init conversation', err);
            }
        };
        fetchConversation();
    }, []);

    const handleReview = React.useCallback(async () => {
        if (!conversationId) return;
        setMessages(prev => [...prev, { role: 'user', content: 'Audit the current buffer for security and performance.' }]);
        setIsStreaming(true);
        try {
            await axios.post('/api/ai/review', { conversationId, code, language });
        } catch (err) {
            setError('Audit Failure: Core disconnected.');
            setIsStreaming(false);
        }
    }, [conversationId, code, language]);

    const handleModify = React.useCallback(async () => {
        if (!input) {
            setError('Directive Required: Provide instructions in the terminal.');
            return;
        }
        if (!conversationId) return;
        setMessages(prev => [...prev, { role: 'user', content: `Evolve code: ${input}` }]);
        setIsStreaming(true);
        try {
            await axios.post('/api/ai/modify', { conversationId, code, instructions: input, language });
            setInput('');
        } catch (err) {
            setError('Evolution Failure: Core reject.');
            setIsStreaming(false);
        }
    }, [conversationId, code, language, input]);

    const handleGenerate = React.useCallback(async () => {
        if (!input) {
            setError('Objective Required: Describe the module to synthesize.');
            return;
        }
        if (!conversationId) return;
        setMessages(prev => [...prev, { role: 'user', content: `Synthesize: ${input}` }]);
        setIsStreaming(true);
        try {
            await axios.post('/api/ai/generate', { conversationId, prompt: input });
            setInput('');
        } catch (err) {
            setError('Synthesis Failure: Core offline.');
            setIsStreaming(false);
        }
    }, [conversationId, input]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || !conversationId) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setError(null);

        try {
            setIsStreaming(true);
            await axios.post('/api/ai/review', { conversationId, code: '// Chat only\n' + userMsg, language });
        } catch (err) {
            setError('System Link Failure: Unable to reach AI Core.');
            setIsStreaming(false);
        }
    };

    // Expose handlers to parent
    useEffect(() => {
        onReview?.(handleReview);
        onModify?.(handleModify);
        onGenerate?.(handleGenerate);
    }, [onReview, onModify, onGenerate, handleReview, handleModify, handleGenerate]);

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden">
            <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <div>
                    <h2 className="text-lg font-display font-bold tracking-tight">Mission Thread</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Principal Architect Mode</p>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:px-6 md:py-8 space-y-6 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                            <Sparkles className="text-primary-600" size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100">Establish Connection</p>
                            <p className="text-xs text-gray-500">Provide directives or use the editor tools to start the analysis.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[90%] p-5 rounded-[2rem] ${msg.role === 'user'
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 rounded-tr-none'
                                : 'glass text-gray-800 dark:text-gray-200 rounded-tl-none'
                                }`}>
                                <div className="prose prose-sm prose-invert dark:prose-p:text-gray-300 dark:prose-strong:text-white max-w-none text-xs leading-relaxed">
                                    <ReactMarkdown components={{
                                        code({ inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="rounded-2xl !bg-black/40 !p-4 !my-4 !border !border-white/5"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className="bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded-lg font-mono font-medium" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                <div className={`text-[9px] font-bold uppercase tracking-widest opacity-40 mt-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.role === 'user' ? 'Client Request' : 'Architect Core'}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
                {isStreaming && (
                    <div className="flex justify-start">
                        <div className="glass px-6 py-4 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                            <div className="flex gap-1">
                                <span className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" />
                                <span className="w-1 h-1 bg-primary-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1 h-1 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 animate-pulse">Streaming Analysis</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-white/40 dark:bg-[#030712]/40 backdrop-blur-xl border-t border-gray-100 dark:border-white/5">
                {error && (
                    <div className="mb-4 p-4 glass bg-rose-500/10 border-rose-500/20 text-accent-rose text-[10px] font-bold uppercase tracking-wider rounded-2xl">
                        {error}
                    </div>
                )}
                <form
                    onSubmit={handleSend}
                    className="relative group glass p-1.5 rounded-[2rem] transition-all focus-within:ring-4 focus-within:ring-primary-500/10"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Direct the Architect..."
                        className="w-full bg-transparent px-6 py-4 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isStreaming}
                        className="absolute right-2 top-2 p-3 bg-primary-600 text-white rounded-[1.5rem] hover:bg-primary-500 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-primary-600/20"
                    >
                        <CornerDownLeft size={18} />
                    </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-3 font-medium uppercase tracking-widest opacity-50">
                    AI-generated code should be reviewed for accuracy.
                </p>
            </div>
        </div>
    );
};

export default ChatPanel;
