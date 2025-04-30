
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface WeekTask {
  id: string;
  title: string;
  status: string;
}

interface WeekDayTasks {
  date: string;
  tasks: WeekTask[];
}

interface WeekViewProps {
  days: WeekDayTasks[];
  onTaskStatusChange: (taskId: string, status: string) => void;
}

// Memoize the day card component for better performance
const DayCard = memo(({ day, onTaskStatusChange }: { 
  day: WeekDayTasks; 
  onTaskStatusChange: (taskId: string, status: string) => void 
}) => {
  return (
    <Card key={day.date}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {format(new Date(day.date), "EEEE, d MMMM", { locale: ru })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {day.tasks.length === 0 ? (
          <div className="text-center py-2 text-muted-foreground text-sm">
            Нет задач
          </div>
        ) : (
          <div className="space-y-2">
            {day.tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2 task-item group">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.status === 'completed'}
                  onCheckedChange={() => onTaskStatusChange(task.id, task.status === 'completed' ? 'not_started' : 'completed')}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 text-sm ${task.status === 'completed' ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DayCard.displayName = "DayCard";

export function WeekView({ days, onTaskStatusChange }: WeekViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {days.map((day) => (
        <DayCard 
          key={day.date} 
          day={day} 
          onTaskStatusChange={onTaskStatusChange} 
        />
      ))}
    </div>
  );
}
