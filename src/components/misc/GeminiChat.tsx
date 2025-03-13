'use client'
import { useState } from 'react'
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, RotateCcw, CalendarPlus, Phone } from 'lucide-react'
import { chatFlow } from '@/app/api/genkit/genkit'
import { motion, AnimatePresence } from 'framer-motion'

export default function GeminiChatbot() {
    
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [id, setId] = useState<number>(1);

    const handleReset = () => {
        setMessages([]);
        setId(1);
    };

    const handleScheduleCall = () => {
        window.open('https://supernorm.al/j/LmuKA5', '_blank');
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message immediately
        const userMessage: Message = { role: 'user', content: input, id: id.toString() };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setId(prev => prev + 1);
        setInput(''); // Clear input right after sending

        try {
            // Get response from API
            const response = await chatFlow(input);
            
            // Add assistant message
            const assistantMessage: Message = { role: 'assistant', content: response, id: (id + 1).toString() };
            setMessages(prevMessages => [...prevMessages, assistantMessage]);
            setId(prev => prev + 1);
        } catch (error) {
            console.error('Error getting response:', error);
        }
    }

    return (
        <div className="fixed bottom-4 left-4 z-[100]">
            <AnimatePresence>
                {!isExpanded ? (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                    >
                        <Button onClick={() => setIsExpanded(true)} className="rounded-full p-4">
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                    >
                        <Card className="w-80 h-fit flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-md font-medium">Chat with ADA</CardTitle>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={handleReset}
                                            className="h-8 w-8 p-0"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-72 w-full pr-4">
                                    {messages.map((m) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", bounce: 0.4 }}
                                            className={`mb-4 ${
                                                m.role === 'user' ? 'text-right' : 'text-left'
                                            }`}
                                        >
                                            <motion.span
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                className={`inline-block p-2 rounded-lg ${
                                                    m.role === 'user'
                                                        ? 'bg-primary text-background'
                                                        : 'bg-muted text-foreground'
                                                }`}
                                            >
                                                {m.content}
                                            </motion.span>
                                        </motion.div>
                                    ))}
                                </ScrollArea>
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
                                        placeholder="Type your message..."
                                        className="flex-grow"
                                    />
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button 
                                            type="button" 
                                            size="icon"
                                            variant="outline"
                                            onClick={handleScheduleCall}
                                            className="mr-2"
                                        >
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button type="submit" size="icon">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </motion.form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

