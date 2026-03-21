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
import { FormField } from "@/shared/components/forms/molecules";
import { BaseInput, BaseCheckbox } from "@/shared/components/forms/atoms";

import { defaultLoginCredentials } from "./defaults";
import type { LoginCredentials } from "./model";
import {
  fieldTypeMappings,
  optionalFields,
  createSchemaOverrides,
  createFieldConfigurations,
  createFormSections,
} from "./config";

export interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<void>;
  showSignupLink?: boolean;
  onSignupClick?: () => void;
  showForgotPassword?: boolean;
  onForgotPasswordClick?: () => void;
}

export function LoginForm({
  onSubmit: onSubmitProp,
  showSignupLink = true,
  onSignupClick,
  showForgotPassword = true,
  onForgotPasswordClick,
}: LoginFormProps) {
  // Build form configuration
  const formConfig = createFormRenderer(defaultLoginCredentials)
    .withFieldTypes(fieldTypeMappings)
    .withSchemaOverrides(createSchemaOverrides())
    .withOptionalFields(optionalFields)
    .withFieldConfigs(createFieldConfigurations())
    .withSections(createFormSections())
    .build();

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    // @ts-expect-error - Zod resolver type inference limitation with generic schema
    resolver: zodResolver(formConfig.schema),
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit = async (data: LoginCredentials) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
    } else {
      // Default behavior - log to console
      console.log("Login submitted:", { ...data, password: "***" });
      alert("Login form submitted! Check console for data.");
    }
  };

  const sections = formConfig.sections || [];
  const section = sections[0]; // Login has single section

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{section?.title || "Sign In"}</CardTitle>
        <CardDescription>
          {section?.description ||
            "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      {/* @ts-expect-error - React Hook Form type inference with Zod resolver */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Email Field */}
          <FormField
            label={formConfig.fieldConfig.email?.label || "Email"}
            error={errors.email?.message}
            required
          >
            <BaseInput
              {...register("email")}
              type="email"
              placeholder={formConfig.fieldConfig.email?.placeholder}
              error={!!errors.email}
            />
          </FormField>

          {/* Password Field */}
          <FormField
            label={formConfig.fieldConfig.password?.label || "Password"}
            error={errors.password?.message}
            required
          >
            <BaseInput
              {...register("password")}
              type="password"
              placeholder={formConfig.fieldConfig.password?.placeholder}
              error={!!errors.password}
            />
          </FormField>

          {/* Remember Me Checkbox */}
          <FormField label="" error={errors.rememberMe?.message}>
            <BaseCheckbox
              {...register("rememberMe")}
              label={formConfig.fieldConfig.rememberMe?.label || "Remember me"}
              description={formConfig.fieldConfig.rememberMe?.description}
            />
          </FormField>

          {/* Forgot Password Link */}
          {showForgotPassword && (
            <div className="text-sm">
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-primary hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          {showSignupLink && (
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSignupClick}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
