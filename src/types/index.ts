
export interface Goal {
  id: string;
  title: string;
  motivation: string;
  deadline: string;
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  parentId?: string;
}

export interface Reflection {
  id: string;
  date: string;
  didImportant: boolean;
  obstacles: string;
  improvements: string;
}

export interface DailyMotivation {
  quote: string;
  author: string;
}

export interface AppState {
  goal: Goal | null;
  tasks: Task[];
  reflections: Reflection[];
  dailyMotivation: DailyMotivation;
}
