
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function GoalCard() {
  const { goal } = useAppContext();
  const navigate = useNavigate();
  
  if (!goal) {
    return (
      <Card className="goal-card mb-6">
        <CardHeader>
          <CardTitle>Добавьте свою цель</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Создайте главную цель, которую хотите достичь, и отслеживайте прогресс.
          </p>
          <Button onClick={() => navigate("/goal-setup")}>
            Создать цель
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Format deadline
  let deadlineDate: Date | null = null;
  try {
    deadlineDate = new Date(goal.deadline);
  } catch (e) {
    console.error("Invalid date format", e);
  }

  const formattedDeadline = deadlineDate ? 
    format(deadlineDate, "d MMMM yyyy", { locale: ru }) : 
    goal.deadline;
  
  const daysLeft = deadlineDate ? 
    Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 
    null;

  return (
    <Card className="goal-card mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{goal.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="italic mb-4 text-muted-foreground">{goal.motivation}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Прогресс</span>
          <span className="text-sm font-medium">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} className="h-2 mb-4" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Дедлайн: {formattedDeadline}</div>
          {daysLeft !== null && (
            <div>{daysLeft > 0 ? `Осталось ${daysLeft} дней` : "Срок истёк"}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
