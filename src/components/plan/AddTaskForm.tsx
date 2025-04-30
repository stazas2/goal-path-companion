import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface AddTaskFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AddTaskForm({ value, onChange, onSubmit, onCancel }: AddTaskFormProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Input
        aria-label="Новая задача"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Новая задача"
        className="flex-1"
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        autoFocus
      />
      <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Отмена">
        <X className="h-4 w-4" />
      </Button>
      <Button size="icon" onClick={onSubmit} aria-label="Добавить задачу">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
