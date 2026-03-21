"use client";

import * as React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import type { DateFieldConfig } from "@/shared/types/forms";

export interface BaseDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: boolean;
  config?: DateFieldConfig;
  className?: string;
}

export const BaseDatePicker = React.forwardRef<
  HTMLDivElement,
  BaseDatePickerProps
>(({ value, onChange }, ref) => {
  return (
    <div ref={ref}>
      <DatePicker date={value} setDate={onChange || (() => {})} />
    </div>
  );
});

BaseDatePicker.displayName = "BaseDatePicker";
