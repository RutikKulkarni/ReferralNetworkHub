import { z } from "zod";
import type {
  FieldType,
  FieldConfig,
  BaseFieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  CheckboxFieldConfig,
  FieldConfigMap,
  SectionConfig,
  RowConfig,
} from "@/shared/types/forms";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormRendererConfig<T extends Record<string, any>> {
  defaultValues: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any>;
  fieldConfig: FieldConfigMap;
  sections?: Array<SectionConfig<T>>;
  rows?: Array<RowConfig<T>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function inferFieldType(value: any): FieldType {
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "checkbox";
  if (Array.isArray(value)) {
    if (value.length === 0 || typeof value[0] === "string") {
      return "checkboxGroup";
    }
    return "multiselect";
  }
  return "text";
}

function generateLabel(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function generateZodSchema(
  fieldName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  type?: FieldType,
): z.ZodTypeAny {
  const fieldLabel = generateLabel(fieldName);

  // Check for common field name patterns
  const lowerFieldName = fieldName.toLowerCase();

  if (type === "email" || lowerFieldName.includes("email")) {
    return z.string().email("Please enter a valid email address");
  }

  if (type === "password" || lowerFieldName.includes("password")) {
    return z.string().min(6, "Password must be at least 6 characters");
  }

  if (type === "number" || typeof value === "number") {
    return z.number({ message: `${fieldLabel} is required` });
  }

  if (type === "checkbox" || typeof value === "boolean") {
    return z.boolean();
  }

  if (
    type === "select" ||
    type === "radio" ||
    type === "cardSelect" ||
    type === "cardRadio"
  ) {
    return z.string({ message: `Please select a ${fieldLabel.toLowerCase()}` });
  }

  if (
    type === "multiselect" ||
    type === "checkboxGroup" ||
    Array.isArray(value)
  ) {
    return z
      .array(z.string())
      .min(1, `Please select at least one ${fieldLabel.toLowerCase()}`);
  }

  if (type === "phone") {
    return z.string().min(10, "Please enter a valid phone number");
  }

  if (type === "date") {
    return z.date({ message: `${fieldLabel} is required` });
  }

  // Default to string
  return z.string().min(1, `${fieldLabel} is required`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormRendererBuilder<T extends Record<string, any>> {
  private _defaultValues: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _schema: z.ZodObject<any>;
  private _fieldConfig: FieldConfigMap;
  private _sections: Array<SectionConfig<T>> = [];
  private _rows: Array<RowConfig<T>> = [];
  private _optionalFields: Set<string> = new Set();

  constructor(defaultModel: T) {
    this._defaultValues = { ...defaultModel };
    this._fieldConfig = {};

    // Generate initial field config and schema
    const schemaShape: Record<string, z.ZodTypeAny> = {};

    for (const [key, value] of Object.entries(defaultModel)) {
      // Infer field type
      const fieldType = inferFieldType(value);

      // Generate default label and placeholder
      const fieldLabel = generateLabel(key);
      const fieldPlaceholder = `Enter ${fieldLabel.toLowerCase()}`;

      // Create base field config
      const baseConfig: BaseFieldConfig = {
        type: fieldType,
        label: fieldLabel,
        placeholder: fieldPlaceholder,
      };

      // Create type-specific config
      if (fieldType === "number") {
        this._fieldConfig[key] = {
          ...baseConfig,
          type: "number",
        } as NumberFieldConfig;
      } else if (fieldType === "checkbox") {
        this._fieldConfig[key] = {
          ...baseConfig,
          type: "checkbox",
        } as CheckboxFieldConfig;
      } else if (fieldType === "select") {
        this._fieldConfig[key] = {
          ...baseConfig,
          type: "select",
          options:
            typeof value === "boolean"
              ? [
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ]
              : [],
        } as SelectFieldConfig;
      } else {
        this._fieldConfig[key] = {
          ...baseConfig,
          type: "text",
        } as TextFieldConfig;
      }

      // Generate Zod schema for this field
      schemaShape[key] = generateZodSchema(key, value, fieldType);
    }

    this._schema = z.object(schemaShape);
  }

  withFieldTypes(fieldTypeMappings: Partial<Record<keyof T, FieldType>>): this {
    for (const [key, type] of Object.entries(fieldTypeMappings) as Array<
      [keyof T, FieldType]
    >) {
      const stringKey = String(key);
      const currentConfig = this._fieldConfig[stringKey] || {};

      // Update type while preserving other config
      const baseConfig: BaseFieldConfig = {
        ...currentConfig,
        type,
      };

      // Update field config based on new type
      this._fieldConfig[stringKey] = baseConfig as FieldConfig;

      // Update schema
      const value = this._defaultValues[key];
      const schemaShape = { ...this._schema.shape };
      schemaShape[stringKey] = generateZodSchema(stringKey, value, type);
      this._schema = z.object(schemaShape);
    }

    return this;
  }

  withOptionalFields(fieldNames: Array<keyof T>): this {
    fieldNames.forEach((fieldName) => {
      this._optionalFields.add(String(fieldName));
    });

    // Update schema to make these fields optional
    const schemaShape = { ...this._schema.shape };
    for (const fieldName of this._optionalFields) {
      if (schemaShape[fieldName]) {
        schemaShape[fieldName] = schemaShape[fieldName].optional();
      }
    }
    this._schema = z.object(schemaShape);

    return this;
  }

  withSchemaOverrides(
    schemaOverrides: Partial<Record<keyof T, z.ZodTypeAny>>,
  ): this {
    const schemaShape = { ...this._schema.shape };

    for (const [key, zodSchema] of Object.entries(schemaOverrides)) {
      schemaShape[key] = zodSchema;
    }

    this._schema = z.object(schemaShape);
    return this;
  }

  withFieldConfig<K extends keyof T>(
    fieldName: K,
    config: Partial<FieldConfig>,
  ): this {
    const stringKey = String(fieldName);
    const currentConfig = this._fieldConfig[stringKey] || {};

    this._fieldConfig[stringKey] = {
      ...currentConfig,
      ...config,
    } as FieldConfig;

    return this;
  }

  withFieldConfigs(configs: Partial<Record<keyof T, FieldConfig>>): this {
    for (const [key, config] of Object.entries(configs)) {
      if (config) {
        this.withFieldConfig(key as keyof T, config);
      }
    }
    return this;
  }

  withSections(sections: Array<SectionConfig<T>>): this {
    this._sections = [...this._sections, ...sections];
    return this;
  }

  withSection(section: SectionConfig<T>): this {
    this._sections.push(section);
    return this;
  }

  withRows(rows: Array<RowConfig<T>>): this {
    this._rows = [...this._rows, ...rows];
    return this;
  }

  withRow(row: RowConfig<T>): this {
    this._rows.push(row);
    return this;
  }

  build(): FormRendererConfig<T> {
    return {
      defaultValues: this._defaultValues,
      schema: this._schema,
      fieldConfig: this._fieldConfig,
      sections: this._sections.length > 0 ? this._sections : undefined,
      rows: this._rows.length > 0 ? this._rows : undefined,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFormRenderer<T extends Record<string, any>>(
  defaultModel: T,
): FormRendererBuilder<T> {
  return new FormRendererBuilder<T>(defaultModel);
}
