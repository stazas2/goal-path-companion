
import { memo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks } from "@/hooks/useTasks";

// Memoize task item for better performance
const TaskItem = memo(({ task, onToggle, onDelete }) => {
  return (
    <div key={task.id} className="task-item group">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={() => onToggle(task.id, task.status)}
          id={`task-dashboard-${task.id}`}
        />
        <label 
          htmlFor={`task-dashboard-${task.id}`}
          className={`flex-1 ${task.status === 'completed' ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(task.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

TaskItem.displayName = "TaskItem";

export function DailyTasks() {
  const [newTask, setNewTask] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  
  const { data: tasks, addTask, updateTask, refetch: refetchTasks } = useTasks({ date: today });

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask.mutate({
        title: newTask.trim(),
        date: today,
        status: 'not_started'
      }, {
        onSuccess: () => {
          setNewTask("");
          setShowAddForm(false);
        }
      });
    }
  };

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    
    updateTask.mutate({ 
      id: taskId, 
      status: newStatus 
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) {
        throw error;
      }
      
      refetchTasks();
      toast.success("Задача удалена");
    } catch (error) {
      toast.error("Не удалось удалить задачу");
    }
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
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
