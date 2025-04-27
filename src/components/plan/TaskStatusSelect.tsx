
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = {
  not_started: "Не начато",
  in_progress: "В процессе",
  completed: "Завершено",
  postponed: "Отложено",
};

interface TaskStatusSelectProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export function TaskStatusSelect({ status, onStatusChange }: TaskStatusSelectProps) {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statuses).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
