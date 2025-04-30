
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface DatePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  title?: string;
}

export function DatePickerDialog({ 
  isOpen, 
  onClose, 
  onSelectDate, 
  title = "Выберите дату"
}: DatePickerDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleConfirm = () => {
    if (selectedDate) {
      onSelectDate(selectedDate);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow"
            locale={ru}
            initialFocus
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDate}>
            {selectedDate ? `Выбрать ${format(selectedDate, "d MMMM", { locale: ru })}` : "Выбрать дату"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
