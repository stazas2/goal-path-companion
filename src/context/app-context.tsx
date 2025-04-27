
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppState, Goal, Task, Reflection, DailyMotivation } from "../types";

// Initial motivation quotes
const motivationalQuotes = [
  { quote: "Ты ближе, чем кажется", author: "Goal Path" },
  { quote: "Маленькие шаги каждый день приводят к большим результатам", author: "Goal Path" },
  { quote: "Не сравнивай себя с другими, сравнивай себя с собой вчерашним", author: "Goal Path" },
  { quote: "Важен не результат, а постоянное движение вперед", author: "Goal Path" },
  { quote: "Каждый день — это новая возможность стать лучше", author: "Goal Path" },
];

// Default state
const defaultState: AppState = {
  goal: null,
  tasks: [],
  reflections: [],
  dailyMotivation: motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
};

// Load data from localStorage or use default
const loadInitialState = (): AppState => {
  const savedState = localStorage.getItem("goalPathState");
  return savedState ? JSON.parse(savedState) : defaultState;
};

interface AppContextType extends AppState {
  setGoal: (goal: Goal) => void;
  addTask: (task: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addReflection: (reflection: Omit<Reflection, "id">) => void;
  updateProgress: (progress: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("goalPathState", JSON.stringify(state));
  }, [state]);

  // Change motivation quote daily
  useEffect(() => {
    const today = new Date().toDateString();
    const lastQuoteDate = localStorage.getItem("lastQuoteDate");
    
    if (today !== lastQuoteDate) {
      setState(prev => ({
        ...prev,
        dailyMotivation: motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      }));
      localStorage.setItem("lastQuoteDate", today);
    }
  }, []);

  // Context methods
  const setGoal = (goal: Goal) => {
    setState(prev => ({ ...prev, goal }));
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setState(prev => ({ 
      ...prev, 
      tasks: [...prev.tasks, newTask] 
    }));
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const removeTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  const addReflection = (reflection: Omit<Reflection, "id">) => {
    const newReflection = {
      ...reflection,
      id: Date.now().toString()
    };
    setState(prev => ({
      ...prev,
      reflections: [...prev.reflections, newReflection]
    }));
  };

  const updateProgress = (progress: number) => {
    if (state.goal) {
      setState(prev => ({
        ...prev,
        goal: prev.goal ? { ...prev.goal, progress } : null
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setGoal,
        addTask,
        toggleTask,
        removeTask,
        addReflection,
        updateProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
