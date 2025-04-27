
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

const Reflection = () => {
  const { addReflection, addTask, reflections } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  // Check if reflection was already done today
  const todayReflection = reflections.find(r => r.date === todayFormatted);
  
  const [didImportant, setDidImportant] = useState<boolean>(todayReflection?.didImportant || false);
  const [obstacles, setObstacles] = useState(todayReflection?.obstacles || "");
  const [improvements, setImprovements] = useState(todayReflection?.improvements || "");
  const [newTask, setNewTask] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add reflection
    if (!todayReflection) {
      addReflection({
        date: todayFormatted,
        didImportant,
        obstacles,
        improvements
      });
    }
    
    // Add task for tomorrow if provided
    if (newTask.trim()) {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
      
      addTask({
        title: newTask.trim(),
        completed: false,
        date: tomorrowFormatted
      });
    }
    
    // Mark today's reflection as done
    localStorage.setItem(`reflection_${today.toDateString()}`, "done");
    
    toast({
      title: "Рефлексия сохранена",
      description: "Ваша ежедневная рефлексия успешно записана."
    });
    
    navigate("/");
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ежедневная рефлексия</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {format(today, "d MMMM yyyy", { locale: ru })}
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Я сделал сегодня что-то важное для цели?</Label>
              <RadioGroup 
                value={didImportant ? "yes" : "no"} 
                onValueChange={(value) => setDidImportant(value === "yes")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">Нет</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="obstacles">Что помогло или мешало сегодня?</Label>
              <Textarea
                id="obstacles"
                value={obstacles}
                onChange={(e) => setObstacles(e.target.value)}
                placeholder="Опишите, что помешало или помогло вам сегодня"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="improvements">Как улучшить прогресс завтра?</Label>
              <Textarea
                id="improvements"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Что можно улучшить завтра?"
                rows={3}
              />
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor="task">Добавить задачу на завтра</Label>
              <Input
                id="task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Например: Сделать 30-минутную тренировку"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit">
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Reflection;
