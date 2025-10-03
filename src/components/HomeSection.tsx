import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HomeSectionProps {
  onStartChat: () => void;
}

const HomeSection = ({ onStartChat }: HomeSectionProps) => {
  return (
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
        <Button size="lg" className="gap-2" onClick={onStartChat}>
          <Icon name="MessageSquare" size={20} />
          Начать чат
        </Button>
      </div>
    </div>
  );
};

export default HomeSection;
