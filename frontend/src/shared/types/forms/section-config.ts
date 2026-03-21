import type { FieldConfig } from "./field-config";

export interface RowConfig<T = any> {
  columns?: number | number[];
  fields: Array<keyof T | FieldConfig>;
  gap?: "none" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
}

export interface SectionConfig<T = any> {
  title?: string;
  titleIcon?: React.ReactNode;
  description?: string;
  fields?: Array<keyof T | FieldConfig>;
  rows?: Array<RowConfig<T>>;
  contentClass?: string;
  sectionClass?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}
