
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

interface SubtasksListProps {
  parentId: string;
  tasks: any[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string) => void;
  onRemoveSubtask: (id: string) => void;
}

export function SubtasksList({
  parentId,
  tasks,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
}: SubtasksListProps) {
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask.trim());
      setNewSubtask("");
    }
  };

  return (
    <div className="ml-6 mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Добавить подзадачу"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
        />
        <Button size="icon" onClick={handleAddSubtask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleSubtask(task.id)}
          />
          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
            {task.title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={() => onRemoveSubtask(task.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
