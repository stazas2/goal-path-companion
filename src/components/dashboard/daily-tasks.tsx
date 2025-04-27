
import { useState } from "react";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check } from "lucide-react";

export function DailyTasks() {
  const { tasks, toggleTask, addTask, removeTask } = useAppContext();
  const [newTask, setNewTask] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.date === today);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({
        title: newTask.trim(),
        completed: false,
        date: today
      });
      setNewTask("");
      setShowAddForm(false);
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

        {todayTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            На сегодня задач нет
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div key={task.id} className="task-item group">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeTask(task.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Удалить</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
