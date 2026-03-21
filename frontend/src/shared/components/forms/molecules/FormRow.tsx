"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormRowProps {
  columns?: number | number[];
  gap?: "none" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
  children: React.ReactNode;
}

const gapClasses = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ columns = 1, gap = "md", align = "start", className, children }, ref) => {
    const gridTemplateColumns = React.useMemo(() => {
      if (typeof columns === "number") {
        return `repeat(${columns}, 1fr)`;
      }
      return columns.map((fr) => `${fr}fr`).join(" ");
    }, [columns]);

    const style = gridTemplateColumns ? { gridTemplateColumns } : undefined;

    return (
      <div
        ref={ref}
        className={cn("grid", gapClasses[gap], alignClasses[align], className)}
        {...(style && { style })}
      >
        {children}
      </div>
    );
  },
);

FormRow.displayName = "FormRow";
