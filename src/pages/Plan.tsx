import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { TaskStatistics } from "@/components/plan/TaskStatistics";
import { TaskStatusSelect } from "@/components/plan/TaskStatusSelect";
import { SubtasksList } from "@/components/plan/SubtasksList";
import { WeekView } from "@/components/plan/WeekView";
import { CompletedTasks } from "@/components/plan/CompletedTasks";
import { AddTaskForm } from "@/components/plan/AddTaskForm";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const formatDateToIso = (date: Date) => {
  return date.toISOString().split('T')[0];
};

function Plan() {
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

  const { data: tasks, addTask: createTask, updateTask } = useTasks({ date: selectedDateIso });

  const { data: subtasks, addTask: createSubtask, updateTask: updateSubtask } = useTasks({ parentId: selectedTask });

  const handleStatusChange = (taskId: string, status: string) => {
    if (subtasks && subtasks.find(t => t.id === taskId)) {
      updateSubtask({ id: taskId, status });
    } else {
      updateTask({ id: taskId, status });
    }
  };

  const handlePostponeTask = (taskId: string) => {
    const nextDate = format(addDays(new Date(selectedDateIso), 1), 'yyyy-MM-dd');
    updateTask({ id: taskId, date: nextDate, status: 'postponed' });
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      createTask({ title: newTask.trim(), date: selectedDateIso, status: 'not_started' });
      setNewTask('');
      setShowAddTask(false);
    }
  };

  const handleAddSubtask = (parentId: string, title: string) => {
    createSubtask({ title, parent_id: parentId, status: 'not_started' });
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
      <CompletedTasks date={selectedDateIso} />
      
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
                aria-label="Добавить новую задачу"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {showAddTask && (
                <AddTaskForm
                  value={newTask}
                  onChange={setNewTask}
                  onSubmit={handleAddTask}
                  onCancel={() => setShowAddTask(false)}
                />
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
        
        <TabsContent value="week">
          <WeekView 
            days={getTasksForWeek()} 
            onTaskStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Plan;
