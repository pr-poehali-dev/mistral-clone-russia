import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const FaqSection = () => {
  const faqItems = [
    { question: 'Как начать использовать AI чат?', answer: 'Просто перейдите в раздел "Чат" и начните задавать вопросы. Система автоматически сохранит историю диалогов.' },
    { question: 'Доступен ли сервис из России?', answer: 'Да, наш сервис полностью доступен из РФ без использования VPN или прокси.' },
    { question: 'Какие модели AI используются?', answer: 'Мы поддерживаем несколько современных языковых моделей, доступных для использования в России.' },
    { question: 'Сохраняется ли история диалогов?', answer: 'Да, все ваши диалоги автоматически сохраняются и доступны в разделе "История".' }
  ];

  return (
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
  );
};

export default FaqSection;
