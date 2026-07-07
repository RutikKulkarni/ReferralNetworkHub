"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id?: string;
  label?: string | null;
  required?: boolean;
  helper?: string;
  error?: string;
  hidden?: boolean;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      id,
      label,
      required,
      helper,
      error,
      hidden,
      className,
      labelClassName,
      children,
    },
    ref,
  ) => {
    const fieldId = React.useId();
    const actualId = id || fieldId;
    const helperId = `${actualId}-helper`;
    const errorId = `${actualId}-error`;

    if (hidden) {
      return null;
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label !== null && label !== undefined && (
          <Label
            htmlFor={actualId}
            className={cn("text-sm font-medium leading-none", labelClassName)}
          >
            {label}
            {required && (
              <span
                className={cn(
                  "ml-1",
                  error ? "text-destructive" : "text-foreground",
                )}
              >
                *
              </span>
            )}
          </Label>
        )}

        <div className="mt-1">
          {React.isValidElement(children)
            ? React.cloneElement(
                children as React.ReactElement<Record<string, unknown>>,
                {
                  id: actualId,
                  "aria-describedby": cn(helper && helperId, error && errorId),
                  "aria-invalid": !!error,
                  error: !!error,
                },
              )
            : children}
        </div>

        {helper && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helper}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
