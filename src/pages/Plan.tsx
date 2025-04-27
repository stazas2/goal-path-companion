
import { useState } from "react";
import { useAppContext } from "@/context/app-context";
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

const Plan = () => {
  const { tasks, toggleTask, addTask, removeTask } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const [newTask, setNewTask] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  
  const today = startOfDay(new Date());
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  // Format selected date to ISO string (YYYY-MM-DD)
  const formatDateToIso = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
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
    return tasks.filter(task => task.date === date);
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
  
  const handleAddTask = () => {
    if (newTask.trim() && selectedDate) {
      addTask({
        title: newTask.trim(),
        completed: false,
        date: formatDateToIso(selectedDate),
      });
      setNewTask("");
      setShowAddTask(false);
    }
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
              
              {getTasksForDate(selectedDateIso).length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  На этот день задач нет
                </div>
              ) : (
                <div className="space-y-2">
                  {getTasksForDate(selectedDateIso).map((task) => (
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
                      </Button>
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
                          </Button>
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
