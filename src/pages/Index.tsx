import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Section = 'home' | 'chat' | 'history' | 'settings' | 'faq' | 'about';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Разработка веб-приложения', lastMessage: 'Как создать React компонент?', date: new Date() },
    { id: '2', title: 'Помощь с кодом', lastMessage: 'Объясни async/await', date: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Вопросы по TypeScript', lastMessage: 'Что такое generics?', date: new Date(Date.now() - 172800000) }
  ]);

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

  const faqItems = [
    { question: 'Как начать использовать AI чат?', answer: 'Просто перейдите в раздел "Чат" и начните задавать вопросы. Система автоматически сохранит историю диалогов.' },
    { question: 'Доступен ли сервис из России?', answer: 'Да, наш сервис полностью доступен из РФ без использования VPN или прокси.' },
    { question: 'Какие модели AI используются?', answer: 'Мы поддерживаем несколько современных языковых моделей, доступных для использования в России.' },
    { question: 'Сохраняется ли история диалогов?', answer: 'Да, все ваши диалоги автоматически сохраняются и доступны в разделе "История".' }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside 
        className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-card border-r border-border flex flex-col overflow-hidden`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">AI CHAT</h1>
          </div>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {activeSection === 'chat' && (
            <>
              <Separator className="my-4" />
              <div className="px-2">
                <p className="text-xs font-semibold text-muted-foreground mb-3 px-2">НЕДАВНИЕ ЧАТЫ</p>
                <div className="space-y-1">
                  {chatHistory.map(chat => (
                    <button
                      key={chat.id}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <p className="text-sm font-medium truncate group-hover:text-primary">{chat.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </aside>

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
          
          <Button variant="outline" size="sm" className="gap-2">
            <Icon name="Plus" size={16} />
            Новый чат
          </Button>
        </header>

        <div className="flex-1 overflow-auto">
          {activeSection === 'home' && (
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
                  <Icon name="Sparkles" size={40} className="text-primary" />
                </div>
                <h1 className="text-4xl font-bold">Добро пожаловать в AI Chat</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Современный AI-ассистент с полным доступом из России. 
                  Задавайте вопросы, получайте ответы, сохраняйте историю.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: 'Zap', title: 'Быстрые ответы', desc: 'Мгновенная обработка запросов' },
                  { icon: 'Shield', title: 'Безопасность', desc: 'Данные защищены и конфиденциальны' },
                  { icon: 'Globe', title: 'Доступ из РФ', desc: 'Работает без VPN' }
                ].map(feature => (
                  <Card key={feature.title} className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon name={feature.icon} size={24} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" className="gap-2" onClick={() => setActiveSection('chat')}>
                  <Icon name="MessageSquare" size={20} />
                  Начать чат
                </Button>
              </div>
            </div>
          )}

          {activeSection === 'chat' && (
            <div className="h-full flex flex-col">
              <ScrollArea className="flex-1 px-6 py-6">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4 max-w-md">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                        <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">Начните новый диалог</h3>
                      <p className="text-muted-foreground">
                        Задайте любой вопрос, и AI-ассистент поможет вам найти ответ
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {message.role === 'assistant' && (
                          <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <Card className={`p-4 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </Card>
                        {message.role === 'user' && (
                          <Avatar className="w-10 h-10 bg-secondary text-secondary-foreground">
                            <AvatarFallback>Вы</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4">
                        <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <Card className="p-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="border-t border-border p-4 bg-card">
                <div className="max-w-3xl mx-auto flex gap-3">
                  <Input 
                    placeholder="Напишите сообщение..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
                    <Icon name={isLoading ? "Loader2" : "Send"} size={20} className={isLoading ? "animate-spin" : ""} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'history' && (
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">История диалогов</h2>
              {chatHistory.map(chat => (
                <Card key={chat.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{chat.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{chat.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">
                        {chat.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Icon name="MoreVertical" size={20} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-2xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Настройки</h2>
              
              <Card className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Модель AI</h3>
                  <p className="text-sm text-muted-foreground mb-3">Выберите языковую модель для диалога</p>
                  <select className="w-full px-4 py-2 border border-border rounded-lg bg-background">
                    <option>GPT-4 (рекомендуется)</option>
                    <option>GPT-3.5 Turbo</option>
                    <option>Claude 3</option>
                  </select>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Язык интерфейса</h3>
                  <p className="text-sm text-muted-foreground mb-3">Выберите язык приложения</p>
                  <select className="w-full px-4 py-2 border border-border rounded-lg bg-background">
                    <option>Русский</option>
                    <option>English</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Темная тема</h3>
                    <p className="text-sm text-muted-foreground">Включить темное оформление</p>
                  </div>
                  <Button variant="outline">Включить</Button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
              {faqItems.map((item, idx) => (
                <Card key={idx} className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="HelpCircle" size={20} className="text-primary" />
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground pl-7">{item.answer}</p>
                </Card>
              ))}
            </div>
          )}

          {activeSection === 'about' && (
            <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon name="Brain" size={40} className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold">О проекте AI Chat</h2>
              </div>
              
              <Card className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Наша миссия</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Сделать современные AI-технологии доступными для пользователей из России. 
                    Мы создали платформу, которая работает стабильно, быстро и без ограничений.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Преимущества</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-0.5" />
                      <span>Полный доступ из России без VPN</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-0.5" />
                      <span>Поддержка русского языка на всех уровнях</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-0.5" />
                      <span>Современные языковые модели</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-0.5" />
                      <span>Безопасное хранение данных</span>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Контакты</h3>
                  <p className="text-muted-foreground">
                    По всем вопросам пишите на email: <span className="text-primary font-medium">support@aichat.ru</span>
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;