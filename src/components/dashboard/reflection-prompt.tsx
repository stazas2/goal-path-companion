
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReflectionPrompt() {
  const navigate = useNavigate();
  
  // We'll use local storage to check if user did reflection today
  const [didTodayReflection] = useState(() => {
    const today = new Date().toDateString();
    return localStorage.getItem(`reflection_${today}`) === "done";
  });
  
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18;
  
  if (didTodayReflection) {
    return null;
  }
  
  return (
    <Card className="border-secondary border-2 mb-6">
      <CardHeader>
        <CardTitle>{isEvening ? "Вечерняя рефлексия" : "Планирование дня"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {isEvening 
            ? "Подведите итоги дня и проанализируйте свой прогресс к цели." 
            : "Спланируйте свой день для достижения цели."}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/reflection")} className="w-full">
          {isEvening ? "Провести рефлексию" : "Спланировать день"}
        </Button>
      </CardFooter>
    </Card>
  );
}
