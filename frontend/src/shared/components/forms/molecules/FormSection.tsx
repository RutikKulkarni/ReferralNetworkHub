"use client";

import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title?: string;
  titleIcon?: React.ReactNode;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  sectionClass?: string;
  contentClass?: string;
  children: React.ReactNode;
}

export const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  (
    {
      title,
      titleIcon,
      description,
      collapsible,
      defaultCollapsed,
      sectionClass,
      contentClass,
      children,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(!defaultCollapsed);

    if (!collapsible) {
      return (
        <div ref={ref} className={cn("space-y-4", sectionClass)}>
          {(title || description) && (
            <div className="space-y-1">
              {title && (
                <div className="flex items-center gap-2">
                  {titleIcon && (
                    <span className="flex-shrink-0">{titleIcon}</span>
                  )}
                  <h3 className="text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                </div>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          <div className={cn("space-y-4", contentClass)}>{children}</div>
        </div>
      );
    }

    // Collapsible version
    return (
      <Collapsible
        ref={ref}
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("space-y-4", sectionClass)}
      >
        <div className="space-y-1">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 hover:opacity-70 transition-opacity">
            <div className="flex items-center gap-2">
              {titleIcon && <span className="flex-shrink-0">{titleIcon}</span>}
              <h3 className="text-lg font-semibold tracking-tight text-left">
                {title}
              </h3>
            </div>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <CollapsibleContent>
          <div className={cn("space-y-4 pt-2", contentClass)}>{children}</div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
);

FormSection.displayName = "FormSection";
