import * as React from "react";
import { Input } from "@/components/ui/input";

export interface BaseInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "prefix"
> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: boolean;
}

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ type = "text", prefix, suffix, error, className, ...props }, ref) => {
    const hasAffixes = prefix || suffix;

    if (!hasAffixes) {
      return (
        <Input
          ref={ref}
          type={type}
          className={className}
          aria-invalid={error}
          {...props}
        />
      );
    }

    return (
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            {prefix}
          </div>
        )}
        <Input
          ref={ref}
          type={type}
          className={`${prefix ? "pl-10" : ""} ${suffix ? "pr-10" : ""} ${className || ""}`}
          aria-invalid={error}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
    );
  },
);

BaseInput.displayName = "BaseInput";
