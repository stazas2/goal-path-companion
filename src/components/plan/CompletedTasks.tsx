
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface CompletedTasksProps {
  date: string;
}

export function CompletedTasks({ date }: CompletedTasksProps) {
  const { data: completedTasks } = useQuery({
    queryKey: ['completedTasks', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', date)
        .eq('status', 'completed')
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    }
  });

  if (!completedTasks?.length) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Завершенные задачи</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-2 text-muted-foreground">
              <span className="line-through">{task.title}</span>
              <span className="text-sm">
                {format(new Date(task.created_at), "HH:mm", { locale: ru })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
