import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Input } from "./input";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "날짜를 선택하세요",
  className,
  disabled = false,
}: DatePickerProps) {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Input
            value={date ? format(date, "yyyy년 MM월 dd일", { locale: ko }) : ""}
            placeholder={placeholder}
            readOnly
            disabled={disabled}
            className={cn("cursor-pointer pr-10", className)}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-haspopup="dialog"
            aria-expanded="false"
          />
        </PopoverTrigger>
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
