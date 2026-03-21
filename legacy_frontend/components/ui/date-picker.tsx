"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = React.useState(
    date ? date.getFullYear() : new Date().getFullYear()
  );

  const years = React.useMemo(() => {
    const years = [];
    for (let year = 1960; year <= 2099; year++) {
      years.push(year);
    }
    return years;
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (value: string) => {
    const newMonth = months.indexOf(value);
    setMonth(newMonth);
    if (date) {
      const newDate = new Date(date.setMonth(newMonth));
      setDate(newDate);
    }
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setYear(newYear);
    if (date) {
      const newDate = new Date(date.setFullYear(newYear));
      setDate(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-3 border-b">
          <Select value={months[month]} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            if (date) {
              setMonth(date.getMonth());
              setYear(date.getFullYear());
            }
            setIsOpen(false);
          }}
          month={new Date(year, month)}
          onMonthChange={(date) => {
            setMonth(date.getMonth());
            setYear(date.getFullYear());
          }}
          defaultMonth={date || new Date()}
          fromYear={1960}
          toYear={2099}
        />
      </PopoverContent>
    </Popover>
  );
}
