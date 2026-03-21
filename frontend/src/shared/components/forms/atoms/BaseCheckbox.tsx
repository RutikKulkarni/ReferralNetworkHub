"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface BaseCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: boolean;

  className?: string;
}

export const BaseCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  BaseCheckboxProps
>(
  (
    {
      checked,
      onCheckedChange,
      label,
      description,
      disabled,
      error,
      className,
    },
    ref,
  ) => {
    const id = React.useId();

    if (!label && !description) {
      return (
        <Checkbox
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-invalid={error}
          className={className}
        />
      );
    }

    return (
      <div className="flex items-start space-x-2">
        <Checkbox
          ref={ref}
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-invalid={error}
          className={className}
        />
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    );
  },
);

BaseCheckbox.displayName = "BaseCheckbox";
