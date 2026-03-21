export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "select"
  | "multiselect"
  | "checkbox"
  | "checkboxGroup"
  | "radio"
  | "textarea"
  | "date"
  | "phone"
  | "numberStepper"
  | "cardSelect"
  | "cardRadio";

export interface FieldOption<T = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}
