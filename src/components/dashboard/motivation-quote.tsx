
import { useAppContext } from "@/context/app-context";
import { Card, CardContent } from "@/components/ui/card";

export function MotivationQuote() {
  const { dailyMotivation } = useAppContext();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <blockquote className="italic border-l-4 border-primary pl-4 py-2">
          <p className="text-lg mb-2">{dailyMotivation.quote}</p>
          {dailyMotivation.author && (
            <footer className="text-sm text-muted-foreground">
              — {dailyMotivation.author}
            </footer>
          )}
        </blockquote>
      </CardContent>
    </Card>
  );
}
