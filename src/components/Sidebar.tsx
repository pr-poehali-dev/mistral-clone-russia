import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export type Section = 'home' | 'chat' | 'history' | 'settings' | 'faq' | 'about';

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
}

interface SidebarProps {
  sidebarOpen: boolean;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  chatHistory: ChatHistory[];
  loadChat: (chatId: string) => void;
}

const Sidebar = ({ sidebarOpen, activeSection, setActiveSection, chatHistory, loadChat }: SidebarProps) => {
  const navigation = [
    { id: 'home' as Section, icon: 'Home', label: 'Главная' },
    { id: 'chat' as Section, icon: 'MessageSquare', label: 'Чат' },
    { id: 'history' as Section, icon: 'Clock', label: 'История' },
    { id: 'settings' as Section, icon: 'Settings', label: 'Настройки' },
    { id: 'faq' as Section, icon: 'HelpCircle', label: 'Вопросы' },
    { id: 'about' as Section, icon: 'Info', label: 'О проекте' }
  ];

  return (
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
                    onClick={() => loadChat(chat.id)}
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
  );
};

export default Sidebar;
