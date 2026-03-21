"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { RadioFieldConfig, FieldOption } from "@/shared/types/forms";

export interface BaseRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: FieldOption[];
  disabled?: boolean;
  error?: boolean;
  config?: RadioFieldConfig;
  className?: string;
  direction?: "vertical" | "horizontal";
}

export const BaseRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  BaseRadioGroupProps
>(
  (
    {
      value,
      onValueChange,
      options,
      disabled,
      error,

      className,
      direction = "vertical",
    },
    ref,
  ) => {
    return (
      <RadioGroup
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        aria-invalid={error}
        className={`${direction === "horizontal" ? "flex flex-wrap gap-4" : "grid gap-3"} ${className || ""}`}
      >
        {options.map((option) => {
          const id = `radio-${option.value}`;
          return (
            <div
              key={String(option.value)}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={String(option.value)}
                id={id}
                disabled={option.disabled || disabled}
              />
              <Label
                htmlFor={id}
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <div>
                  <div>{option.label}</div>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  },
);

BaseRadioGroup.displayName = "BaseRadioGroup";
