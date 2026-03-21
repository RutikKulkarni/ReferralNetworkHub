"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormRenderer } from "@/shared/utils/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormRow,
  FormSection,
} from "@/shared/components/forms/molecules";
import { BaseInput, BaseCheckbox } from "@/shared/components/forms/atoms";

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
  showLoginLink?: boolean;
  onLoginClick?: () => void;
}

export function SignupForm({
  onSubmit: onSubmitProp,
  showLoginLink = true,
  onLoginClick,
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
    // @ts-expect-error - Zod resolver type inference limitation with generic schema
    resolver: zodResolver(schemaWithPasswordMatch),
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit = async (data: SignupData) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
    } else {
      // Default behavior - log to console
      console.log("Signup submitted:", {
        ...data,
        password: "***",
        confirmPassword: "***",
      });
      alert("Signup form submitted! Check console for data.");
    }
  };

  const sections = formConfig.sections || [];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Join us today and start connecting with professionals
        </CardDescription>
      </CardHeader>
      {/* @ts-expect-error - React Hook Form type inference with Zod resolver */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
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

                    // Handle checkbox fields separately
                    if (
                      fieldName === "acceptTerms" ||
                      fieldName === "subscribeNewsletter"
                    ) {
                      return (
                        <FormField
                          key={String(fieldName)}
                          label=""
                          error={error?.message}
                        >
                          <BaseCheckbox
                            {...register(fieldName)}
                            label={fieldConfig?.label || String(fieldName)}
                            description={fieldConfig?.description}
                          />
                        </FormField>
                      );
                    }

                    // Regular input fields
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
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>

          {showLoginLink && (
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
