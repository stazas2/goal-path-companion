
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Мотивационные цитаты
const motivationalQuotes = [
  { quote: "Ты ближе, чем кажется", author: "Goal Path" },
  { quote: "Маленькие шаги каждый день приводят к большим результатам", author: "Goal Path" },
  { quote: "Не сравнивай себя с другими, сравнивай себя с собой вчерашним", author: "Goal Path" },
  { quote: "Важен не результат, а постоянное движение вперед", author: "Goal Path" },
  { quote: "Каждый день — это новая возможность стать лучше", author: "Goal Path" },
  { quote: "Успех — это сумма небольших усилий, повторяющихся день за днем", author: "Роберт Кольер" },
  { quote: "Путь в тысячу ли начинается с первого шага", author: "Лао Цзы" },
  { quote: "Сложнее всего начать действовать, все остальное зависит только от упорства", author: "Амелия Эрхарт" },
  { quote: "Лучше сделать и жалеть, чем жалеть, что не сделал", author: "Народная мудрость" },
  { quote: "Никогда не сдавайся. Никогда не останавливайся", author: "Конрад Анкер" },
];

const Motivation = () => {
  const { goal, updateProgress } = useAppContext();
  const { toast } = useToast();
  
  const [progress, setProgress] = useState(goal?.progress || 0);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  // Update quote when component mounts
  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);
  
  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
  };
  
  const handleSaveProgress = () => {
    updateProgress(progress);
    toast({
      title: "Прогресс обновлен",
      description: `Ваш прогресс теперь составляет ${progress}%`,
    });
  };
  
  const getRandomQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Мотивация и прогресс</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Прогресс к цели</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {goal ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Прогресс</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="pt-4">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Обновите ваш текущий прогресс к цели:
                  </p>
                  <Slider
                    defaultValue={[progress]}
                    max={100}
                    step={5}
                    onValueChange={handleProgressChange}
                    className="mb-6"
                  />
                  <Button onClick={handleSaveProgress} className="w-full">
                    Сохранить прогресс
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Сначала создайте цель на главной странице
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Мотивационная цитата</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <blockquote className="italic border-l-4 border-primary pl-4 py-2">
              <p className="text-lg mb-2">{quote.quote}</p>
              {quote.author && (
                <footer className="text-sm text-muted-foreground">
                  — {quote.author}
                </footer>
              )}
            </blockquote>
            
            <Button onClick={getRandomQuote} variant="outline" className="w-full">
              Показать другую цитату
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Motivation;
