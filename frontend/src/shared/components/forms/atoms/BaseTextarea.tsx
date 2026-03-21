import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import type { TextareaFieldConfig } from "@/shared/types/forms";

export interface BaseTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "rows"
> {
  rows?: number;
  error?: boolean;
  config?: TextareaFieldConfig;
}

export const BaseTextarea = React.forwardRef<
  HTMLTextAreaElement,
  BaseTextareaProps
>(({ rows = 4, error, className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      rows={rows}
      className={className}
      aria-invalid={error}
      {...props}
    />
  );
});

BaseTextarea.displayName = "BaseTextarea";
