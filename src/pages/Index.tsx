import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import Sidebar, { Section, ChatHistory } from '@/components/Sidebar';
import ChatSection, { Message } from '@/components/ChatSection';
import HomeSection from '@/components/HomeSection';
import HistorySection from '@/components/HistorySection';
import SettingsSection from '@/components/SettingsSection';
import FaqSection from '@/components/FaqSection';
import AboutSection from '@/components/AboutSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/dce3f92e-296c-4523-b3a7-65f80dfe2498');
      const data = await response.json();
      if (data.chats) {
        setChatHistory(data.chats.map((chat: any) => ({
          id: chat.id.toString(),
          title: chat.title,
          lastMessage: chat.lastMessage,
          date: new Date(chat.date)
        })));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/7ec8d3dd-dff9-43e2-bece-99b83b4ac785?chat_id=${chatId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        })));
        setCurrentChatId(chatId);
        setActiveSection('chat');
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const saveCurrentChat = async () => {
    if (messages.length === 0) return;
    
    const title = messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '');
    
    try {
      const response = await fetch('https://functions.poehali.dev/8d7a3179-c739-4f8a-998f-e26efdfa175b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });
      
      const data = await response.json();
      if (data.chat_id) {
        setCurrentChatId(data.chat_id.toString());
        await loadChatHistory();
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setActiveSection('chat');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/2d8e6f22-ac2c-4cde-8e2d-08673f484e69', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: 'gpt-3.5-turbo'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.message) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        
        if (!currentChatId) {
          setTimeout(() => saveCurrentChat(), 500);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.error || 'Произошла ошибка при обработке запроса. Проверьте настройки API ключа.',
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Ошибка соединения с сервером. Попробуйте позже.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = [
    { id: 'home' as Section, icon: 'Home', label: 'Главная' },
    { id: 'chat' as Section, icon: 'MessageSquare', label: 'Чат' },
    { id: 'history' as Section, icon: 'Clock', label: 'История' },
    { id: 'settings' as Section, icon: 'Settings', label: 'Настройки' },
    { id: 'faq' as Section, icon: 'HelpCircle', label: 'Вопросы' },
    { id: 'about' as Section, icon: 'Info', label: 'О проекте' }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        chatHistory={chatHistory}
        loadChat={loadChat}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={20} />
            </Button>
            <h2 className="text-lg font-semibold">
              {navigation.find(n => n.id === activeSection)?.label}
            </h2>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2" onClick={startNewChat}>
            <Icon name="Plus" size={16} />
            Новый чат
          </Button>
        </header>

        <div className="flex-1 overflow-auto">
          {activeSection === 'home' && (
            <HomeSection onStartChat={() => setActiveSection('chat')} />
          )}

          {activeSection === 'chat' && (
            <ChatSection 
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}

          {activeSection === 'history' && (
            <HistorySection chatHistory={chatHistory} loadChat={loadChat} />
          )}

          {activeSection === 'settings' && <SettingsSection />}

          {activeSection === 'faq' && <FaqSection />}

          {activeSection === 'about' && <AboutSection />}
        </div>
      </main>
    </div>
  );
};

export default Index;
