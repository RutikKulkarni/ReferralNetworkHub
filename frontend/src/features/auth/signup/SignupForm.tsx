"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormRenderer } from "@/shared/utils/forms";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormRow,
  FormSection,
} from "@/shared/components/forms/molecules";
import { BaseInput } from "@/shared/components/forms/atoms";
import { Icons } from "@/components/icons";

import { defaultSignupData } from "./defaults";
import type { SignupData } from "./model";
import {
  fieldTypeMappings,
  optionalFields,
  createSchemaOverrides,
  createFieldConfigurations,
  createFormSections,
} from "./config";

export interface SignupFormProps {
  onSubmit?: (data: SignupData) => Promise<void>;
  onSocialSignup?: (provider: "github" | "linkedin") => void;
}

export function SignupForm({
  onSubmit: onSubmitProp,
  onSocialSignup,
}: SignupFormProps) {
  // Build form configuration
  const formConfig = createFormRenderer(defaultSignupData)
    .withFieldTypes(fieldTypeMappings)
    .withSchemaOverrides(createSchemaOverrides())
    .withOptionalFields(optionalFields)
    .withFieldConfigs(createFieldConfigurations())
    .withSections(createFormSections())
    .build();

  // Add password match validation
  const schemaWithPasswordMatch = formConfig.schema.refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(
      schemaWithPasswordMatch,
    ) as unknown as Resolver<SignupData>,
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
    } else {
      // Default behavior - log to console
      console.log("Signup submitted:", {
        ...data,
        password: "***",
        confirmPassword: "***",
      });
      toast.success("Signup form submitted! Check console for data.");
    }
  };

  const sections = formConfig.sections || [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto space-y-6"
    >
      <div className="space-y-6">
        {sections.map((section, sectionIdx) => (
          <FormSection
            key={sectionIdx}
            title={section.title}
            description={section.description}
          >
            {section.rows?.map((row, rowIdx) => (
              <FormRow key={rowIdx} columns={row.columns}>
                {row.fields.map((field) => {
                  // Field can be either a field name or FieldConfig
                  // We only support field names for now
                  if (typeof field !== "string") return null;
                  const fieldName = field as keyof SignupData;
                  const fieldConfig = formConfig.fieldConfig[fieldName];
                  const error = errors[fieldName];
                  const isOptional = optionalFields.includes(fieldName);

                  return (
                    <FormField
                      key={String(fieldName)}
                      label={fieldConfig?.label || String(fieldName)}
                      error={error?.message}
                      required={!isOptional}
                    >
                      <BaseInput
                        {...register(fieldName)}
                        type={
                          (fieldConfig?.type as
                            | "text"
                            | "email"
                            | "password"
                            | "number") || "text"
                        }
                        placeholder={fieldConfig?.placeholder}
                        error={!!error}
                      />
                    </FormField>
                  );
                })}
              </FormRow>
            ))}
          </FormSection>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      {/* Social Signup Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Signup Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onSocialSignup?.("github")}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onSocialSignup?.("linkedin")}
        >
          <Icons.linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
      </div>
    </form>
  );
}
