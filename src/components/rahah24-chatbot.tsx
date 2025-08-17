'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { rahah24Chatbot, type ChatbotInput, type ChatbotOutput } from '@/ai/flows/rahah24-chatbot';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
}

interface Rahah24ChatbotProps {
  className?: string;
}

export function Rahah24Chatbot({ className }: Rahah24ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Assalamu Alaikum! I\'m your Rahah24 AI Assistant. How can I help you today with your business operations?',
      timestamp: new Date(),
      suggestedActions: [
        'Show me today\'s sales summary',
        'How is student progress in Madrasa?',
        'Navigate to inventory management',
        'Explain this dashboard'
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBusinessContext = (): string => {
    if (pathname.includes('/business/restaurant')) return 'restaurant';
    if (pathname.includes('/business/shadi-lawn')) return 'shadi-lawn';
    if (pathname.includes('/business/gym-time')) return 'gym-time';
    if (pathname.includes('/business/madrasa')) return 'madrasa';
    return 'general';
  };

  const getCurrentPage = (): string => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments[pathSegments.length - 1] || 'dashboard';
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const chatbotInput: ChatbotInput = {
        message: currentMessage,
        businessContext: getBusinessContext(),
        currentPage: getCurrentPage(),
        chatHistory: messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };

      const response: ChatbotOutput = await rahah24Chatbot(chatbotInput);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment, or contact support if the issue persists.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedAction = (action: string) => {
    setCurrentMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'transition-all duration-300 hover:scale-105',
          'border-2 border-primary-foreground/20',
          className
        )}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open Rahah24 AI Assistant</span>
      </Button>
    );
  }

  return (
    <Card 
      className={cn(
        'fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl border-primary/20',
        'bg-background/95 backdrop-blur-lg',
        isMinimized && 'h-16',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary/5">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          Rahah24 AI Assistant
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-[calc(600px-80px)] p-0">
          {/* Business Context Badge */}
          <div className="px-4 py-2 border-b">
            <Badge variant="outline" className="text-xs">
              Context: {getBusinessContext() === 'restaurant' ? 'Restaurant' :
                      getBusinessContext() === 'shadi-lawn' ? 'Shadi Lawn' :
                      getBusinessContext() === 'gym-time' ? 'Gym Time' :
                      getBusinessContext() === 'madrasa' ? 'Tahfeez Madrasa' : 'General'}
            </Badge>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.suggestedActions && message.suggestedActions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs opacity-75 font-medium">Suggested actions:</p>
                        {message.suggestedActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 text-xs text-left justify-start w-full bg-primary/10 hover:bg-primary/20"
                            onClick={() => handleSuggestedAction(action)}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your business..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI Assistant for Jamia Binoria ERP System
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}