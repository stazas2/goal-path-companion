
import { useAppContext } from "@/context/app-context";
import { GoalCard } from "@/components/dashboard/goal-card";
import { DailyTasks } from "@/components/dashboard/daily-tasks";
import { MotivationQuote } from "@/components/dashboard/motivation-quote";
import { ReflectionPrompt } from "@/components/dashboard/reflection-prompt";

const Dashboard = () => {
  const { goal } = useAppContext();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      
      <GoalCard />
      
      {goal && (
        <>
          <ReflectionPrompt />
          <DailyTasks />
          <MotivationQuote />
        </>
      )}
    </div>
  );
};

export default Dashboard;
