"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldOption } from "@/shared/types/forms";

export interface BaseSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: FieldOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const BaseSelect = React.forwardRef<HTMLButtonElement, BaseSelectProps>(
  (
    {
      value,
      onValueChange,
      options,
      placeholder = "Select an option...",
      disabled,
      error,
      className,
    },
    ref,
  ) => {
    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className} aria-invalid={error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              <div className="flex items-center gap-2">
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);

BaseSelect.displayName = "BaseSelect";
