import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ChatHistory } from './Sidebar';

interface HistorySectionProps {
  chatHistory: ChatHistory[];
  loadChat: (chatId: string) => void;
}

const HistorySection = ({ chatHistory, loadChat }: HistorySectionProps) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">История диалогов</h2>
      {chatHistory.map(chat => (
        <Card key={chat.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => loadChat(chat.id)}>
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
  );
};

export default HistorySection;
