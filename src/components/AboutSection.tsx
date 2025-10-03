import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const AboutSection = () => {
  return (
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
  );
};

export default AboutSection;
