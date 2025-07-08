'use client'
import { useState } from 'react'
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, RotateCcw, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { accessAPI } from '@/utils/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChatResponse } from '@/lib/public/ada'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const FullChat = () => {
    const router = useRouter()
    const {data:session} = useSession()
    const {t} = useTranslationProvider()
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [id, setId] = useState<number>(1);
    const [isTyping, setIsTyping] = useState(false);

    const handleReset = () => {
        setMessages([]);
        setId(1);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        // Add user message immediately
        const userMessage: Message = { role: 'user', content: input, id: id.toString() };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setId(prev => prev + 1);
        setInput(''); // Clear input right after sending
        setIsTyping(true);

        try {
            // Call Ada chat endpoint directly
            const response: ChatResponse = await accessAPI('/ada/chat', 'POST', { messages: [{ role: 'user', content: input }] });
            // Add assistant message
            const assistantMessage: Message = { 
                role: 'assistant', 
                content: response.message.content, 
                id: (id + 1).toString() 
            };
            setMessages(prevMessages => [...prevMessages, assistantMessage]);
            setId(prev => prev + 1);
        } catch (error) {
            const errorMessage: Message = { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error. Please try again.', 
                id: (id + 1).toString() 
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            setId(prev => prev + 1);
        } finally {
            setIsTyping(false);
        }
    }
    
    if (!session) return null

    return (
        <Card className="flex-1 flex flex-col border-none shadow-none backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-2xl text-foreground font-bold w-full">{t('ada.title')}</CardTitle>
                    <div className="flex justify-center w-fit">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleReset}
                            className="h-8 w-8 p-0"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 gap-4">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-muted-foreground">
                            <Bot className="h-12 w-12" />
                            <p className="text-center">{t('ada.start_conversation')}</p>
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 pr-4">
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", bounce: 0.4 }}
                                    className={`mb-4 flex ${
                                        m.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {m.role === 'assistant' && (
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            m.role === 'user'
                                                ? 'bg-primary text-background'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({children, ...props}: React.PropsWithChildren<{}>) => (
                                                        <p className="m-0" {...props}>{children}</p>
                                                    ),
                                                    a: ({children, href, ...props}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
                                                        <a className="text-blue-500 hover:underline" href={href} {...props}>{children}</a>
                                                    ),
                                                    code: ({children, ...props}: React.PropsWithChildren<{}>) => (
                                                        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props}>{children}</code>
                                                    )
                                                }}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-muted-foreground"
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg">
                                        {t('ada.typing')}
                                    </div>
                                </motion.div>
                            )}
                        </ScrollArea>
                    )}
                    <motion.form 
                        className="flex w-full space-x-2" 
                        onSubmit={handleSubmit}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('ada.placeholder')}
                            className="flex-grow"
                            disabled={isTyping}
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                type="submit" 
                                size="icon"
                                disabled={isTyping}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </motion.form>
                </CardContent>
            </Card>
    )
}

export default FullChat;
