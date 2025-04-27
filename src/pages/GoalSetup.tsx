
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const GoalSetup = () => {
  const { goal, setGoal } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(goal?.title || "");
  const [motivation, setMotivation] = useState(goal?.motivation || "");
  const [deadline, setDeadline] = useState(goal?.deadline || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите название цели",
        variant: "destructive",
      });
      return;
    }
    
    if (!deadline) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите дедлайн",
        variant: "destructive",
      });
      return;
    }
    
    setGoal({
      id: goal?.id || Date.now().toString(),
      title,
      motivation,
      deadline,
      progress: goal?.progress || 0
    });
    
    toast({
      title: "Успешно!",
      description: "Цель успешно сохранена",
    });
    
    navigate("/");
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{goal ? "Редактирование цели" : "Создание цели"}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Моя главная цель</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Название цели
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Дойти до +50% дохода к сентябрю"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="motivation" className="text-sm font-medium">
                Почему это важно
              </label>
              <Textarea
                id="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Короткая мотивационная заметка"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">
                Дедлайн
              </label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Отмена
            </Button>
            <Button type="submit">
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default GoalSetup;
