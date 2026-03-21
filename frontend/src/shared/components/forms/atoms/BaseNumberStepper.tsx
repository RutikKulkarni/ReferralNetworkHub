"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { NumberStepperFieldConfig } from "@/shared/types/forms";

export interface BaseNumberStepperProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: boolean;
  config?: NumberStepperFieldConfig;
  className?: string;
}

export const BaseNumberStepper = React.forwardRef<
  HTMLInputElement,
  BaseNumberStepperProps
>(
  (
    { value = 0, onChange, min = 0, max, step = 1, disabled, error, className },
    ref,
  ) => {
    const handleIncrement = () => {
      const newValue = (value || 0) + step;
      if (max === undefined || newValue <= max) {
        onChange?.(newValue);
      }
    };

    const handleDecrement = () => {
      const newValue = (value || 0) - step;
      if (newValue >= min) {
        onChange?.(newValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        if (
          (min === undefined || newValue >= min) &&
          (max === undefined || newValue <= max)
        ) {
          onChange?.(newValue);
        }
      }
    };

    const isMinReached = min !== undefined && (value || 0) <= min;
    const isMaxReached = max !== undefined && (value || 0) >= max;

    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || isMinReached}
          className="h-10 w-10 shrink-0"
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <Input
          ref={ref}
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-invalid={error}
          className="text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || isMaxReached}
          className="h-10 w-10 shrink-0"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);

BaseNumberStepper.displayName = "BaseNumberStepper";
