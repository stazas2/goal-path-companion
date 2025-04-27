
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
}

export function TaskStatistics({ date }: { date: string }) {
  const { data: stats } = useQuery({
    queryKey: ['taskStats', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_daily_completion_rate', { p_date: date });
      
      if (error) throw error;
      return data[0] as TaskStats;
    }
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Статистика за день</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats?.total_tasks || 0}</div>
            <div className="text-sm text-muted-foreground">Всего задач</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats?.completed_tasks || 0}</div>
            <div className="text-sm text-muted-foreground">Выполнено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats?.completion_rate || 0}%</div>
            <div className="text-sm text-muted-foreground">Выполнение</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
