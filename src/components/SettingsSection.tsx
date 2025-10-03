import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SettingsSection = () => {
  return (
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
  );
};

export default SettingsSection;
