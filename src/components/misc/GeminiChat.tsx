'use client'
import { useState } from 'react'
import { Message } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X } from 'lucide-react'
import { chatFlow } from '@/app/api/genkit/genkit'

export default function GeminiChatbot() {
    
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [id, setId] = useState<number>(1);

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
    <div className="fixed bottom-4 right-4">
      {!isExpanded ? (
        <Button onClick={() => setIsExpanded(true)} className="rounded-full p-4">
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-fit flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat with AGM</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full pr-4">
                {messages.map((m) => (
                    <div
                    key={m.id}
                    className={`mb-4 ${
                        m.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                    >
                    <span
                        className={`inline-block p-2 rounded-lg ${
                        m.role === 'user'
                            ? 'bg-primary text-background'
                            : 'bg-muted text-foreground'
                        }`}
                    >
                        {m.content}
                    </span>
                    </div>
                ))}
            </ScrollArea>
            <form className="flex w-full space-x-2" onSubmit={handleSubmit}>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

