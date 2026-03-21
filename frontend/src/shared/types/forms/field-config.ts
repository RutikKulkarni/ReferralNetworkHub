import type { FieldType, FieldOption } from "./field-types";

export interface BaseFieldConfig {
  type?: FieldType;
  label?: string | null;
  placeholder?: string;
  helper?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hidden?: boolean | ((values: any) => boolean);
  hideOptionalLabel?: boolean;
  autocomplete?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
  maxLength?: number;
  minLength?: number;
}

export interface EmailFieldConfig extends BaseFieldConfig {
  type: "email";
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: "password";
  showPasswordToggle?: boolean;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: FieldOption[];
  searchable?: boolean;
  clearable?: boolean;
}

export interface MultiSelectFieldConfig extends BaseFieldConfig {
  type: "multiselect";
  options: FieldOption[];
  searchable?: boolean;
  maxSelectedLabels?: number;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
}

export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
  type: "checkboxGroup";
  options: FieldOption[];
  title?: string;
  showTitle?: boolean;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: FieldOption[];
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  minDate?: Date;
  maxDate?: Date;
}

export interface PhoneFieldConfig extends BaseFieldConfig {
  type: "phone";
  defaultCountry?: string;
}

export interface NumberStepperFieldConfig extends BaseFieldConfig {
  type: "numberStepper";
  min?: number;
  max?: number;
  step?: number;
}

export interface CardSelectFieldConfig extends BaseFieldConfig {
  type: "cardSelect";
  options: FieldOption[];
  columns?: number;
}

export interface CardRadioFieldConfig extends BaseFieldConfig {
  type: "cardRadio";
  options: FieldOption[];
  columns?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | EmailFieldConfig
  | PasswordFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | MultiSelectFieldConfig
  | CheckboxFieldConfig
  | CheckboxGroupFieldConfig
  | RadioFieldConfig
  | TextareaFieldConfig
  | DateFieldConfig
  | PhoneFieldConfig
  | NumberStepperFieldConfig
  | CardSelectFieldConfig
  | CardRadioFieldConfig;

export type FieldConfigMap = Record<string, FieldConfig>;
