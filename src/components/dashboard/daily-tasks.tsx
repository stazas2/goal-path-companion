
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DailyTasks() {
  const [newTask, setNewTask] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  
  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ['daily-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', today)
        .is('parent_id', null)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.trim(),
          date: today,
          status: 'not_started'
        });

      if (error) {
        toast.error("Не удалось создать задачу");
        return;
      }

      setNewTask("");
      setShowAddForm(false);
      await refetchTasks();
      toast.success("Задача создана");
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast.error("Не удалось обновить статус задачи");
      return;
    }

    await refetchTasks();
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Задачи на сегодня</CardTitle>
        {!showAddForm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Добавить задачу</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="flex items-center space-x-2 mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Новая задача"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleAddTask}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!tasks?.length ? (
          <div className="text-center py-6 text-muted-foreground">
            На сегодня задач нет
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="task-item group">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleTask(task.id, task.status)}
                    className="rounded border-gray-300"
                  />
                  <label className={`flex-1 ${task.status === 'completed' ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={async () => {
                      const { error } = await supabase
                        .from('tasks')
                        .delete()
                        .eq('id', task.id);
                      
                      if (error) {
                        toast.error("Не удалось удалить задачу");
                        return;
                      }
                      
                      await refetchTasks();
                      toast.success("Задача удалена");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
