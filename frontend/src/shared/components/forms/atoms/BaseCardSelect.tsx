"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CardSelectFieldConfig, FieldOption } from "@/shared/types/forms";

export interface BaseCardSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: FieldOption[];
  columns?: number;
  disabled?: boolean;
  error?: boolean;
  config?: CardSelectFieldConfig;
  className?: string;
}

export const BaseCardSelect = React.forwardRef<
  HTMLDivElement,
  BaseCardSelectProps
>(
  (
    { value, onChange, options, columns = 3, disabled, error, className },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-3",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-4",
          className,
        )}
        role="radiogroup"
        aria-invalid={error}
      >
        {options.map((option) => {
          const isSelected = String(option.value) === String(value);
          const isDisabled = option.disabled || disabled;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => !isDisabled && onChange?.(String(option.value))}
              disabled={isDisabled}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-6 text-center transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected ? "border-primary bg-primary/5" : "border-border",
              )}
              role="radio"
              aria-checked={isSelected}
            >
              {option.icon && (
                <div className="text-4xl flex-shrink-0">{option.icon}</div>
              )}
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

BaseCardSelect.displayName = "BaseCardSelect";
