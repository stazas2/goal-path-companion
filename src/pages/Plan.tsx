import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays, startOfWeek, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Calendar as CalendarIcon, Plus } from "lucide-react";
import { TaskStatistics } from "@/components/plan/TaskStatistics";
import { TaskStatusSelect } from "@/components/plan/TaskStatusSelect";
import { SubtasksList } from "@/components/plan/SubtasksList";
import { toast } from "sonner";

// Format selected date to ISO string (YYYY-MM-DD)
const formatDateToIso = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const Plan = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const [newTask, setNewTask] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  const today = startOfDay(new Date());
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  const selectedDateIso = selectedDate ? formatDateToIso(selectedDate) : formatDateToIso(today);
  
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(currentWeekStart, i));
    }
    return dates;
  };
  
  const weekDates = getWeekDates();
  
  const getTasksForDate = (date: string) => {
    return tasks?.filter(task => task.date === date) || [];
  };
  
  const getTasksForWeek = () => {
    const weekTasks = [];
    for (let i = 0; i < 7; i++) {
      const date = formatDateToIso(addDays(currentWeekStart, i));
      const tasksForDate = getTasksForDate(date);
      weekTasks.push({ date, tasks: tasksForDate });
    }
    return weekTasks;
  };

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', selectedDateIso],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', selectedDateIso)
        .is('parent_id', null)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: subtasks } = useQuery({
    queryKey: ['subtasks', selectedTask],
    enabled: !!selectedTask,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('parent_id', selectedTask)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleStatusChange = async (taskId: string, status: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) {
      toast.error("Не удалось обновить статус задачи");
      return;
    }
    
    refetchTasks();
    toast.success("Статус задачи обновлен");
  };

  const handlePostponeTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        date: format(addDays(new Date(selectedDateIso), 1), 'yyyy-MM-dd'),
        status: 'postponed'
      })
      .eq('id', taskId);

    if (error) {
      toast.error("Не удалось отложить задачу");
      return;
    }
    
    refetchTasks();
    toast.success("Задача отложена на завтра");
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.trim(),
          date: selectedDateIso,
          status: 'not_started'
        });

      if (error) {
        toast.error("Не удалось создать задачу");
        return;
      }

      setNewTask("");
      setShowAddTask(false);
      refetchTasks();
      toast.success("Задача создана");
    }
  };

  const handleAddSubtask = async (parentId: string, title: string) => {
    const { error } = await supabase
      .from('tasks')
      .insert({
        title,
        parent_id: parentId,
        date: selectedDateIso,
        is_subtask: true,
        status: 'not_started'
      });

    if (error) {
      toast.error("Не удалось создать подзадачу");
      return;
    }

    refetchTasks();
    toast.success("Подзадача создана");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">План действий</h1>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "d MMMM", { locale: ru }) : "Выбрать дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setView("day");
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <TaskStatistics date={selectedDateIso} />
      
      <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week")}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="day">День</TabsTrigger>
          <TabsTrigger value="week">Неделя</TabsTrigger>
        </TabsList>
        
        <TabsContent value="day" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedDate 
                  ? format(selectedDate, "d MMMM yyyy", { locale: ru }) 
                  : "Сегодня"}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setShowAddTask(!showAddTask)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {showAddTask && (
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Новая задача"
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={() => setShowAddTask(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handleAddTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!tasks?.length ? (
                <div className="text-center py-6 text-muted-foreground">
                  На этот день задач нет
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <Checkbox 
                          checked={task.status === 'completed'}
                          onCheckedChange={() => handleStatusChange(task.id, task.status === 'completed' ? 'not_started' : 'completed')}
                        />
                        <span className={task.status === 'completed' ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </span>
                        <div className="ml-auto flex items-center space-x-2">
                          <TaskStatusSelect
                            status={task.status}
                            onStatusChange={(status) => handleStatusChange(task.id, status)}
                          />
                          <Button
                            variant="outline"
                            onClick={() => handlePostponeTask(task.id)}
                          >
                            Отложить
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {selectedTask === task.id && (
                        <SubtasksList
                          parentId={task.id}
                          tasks={subtasks || []}
                          onAddSubtask={(title) => handleAddSubtask(task.id, title)}
                          onToggleSubtask={(id) => handleStatusChange(id, subtasks?.find(t => t.id === id)?.status === 'completed' ? 'not_started' : 'completed')}
                          onRemoveSubtask={async (id) => {
                            const { error } = await supabase
                              .from('tasks')
                              .delete()
                              .eq('id', id);
                            
                            if (error) {
                              toast.error("Не удалось удалить подзадачу");
                              return;
                            }
                            
                            refetchTasks();
                            toast.success("Подзадача удалена");
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getTasksForWeek().map((day) => (
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
                            onCheckedChange={() => handleStatusChange(task.id, task.status === 'completed' ? 'not_started' : 'completed')}
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Plan;
