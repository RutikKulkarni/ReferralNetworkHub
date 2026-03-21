"use client";

import * as React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormRenderer } from "@/shared/utils/forms";
import { Button } from "@/components/ui/button";
import { FormField } from "@/shared/components/forms/molecules";
import { BaseInput } from "@/shared/components/forms/atoms";
import { Icons } from "@/components/icons";

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
  onSocialLogin?: (provider: "github" | "linkedin") => void;
}

export function LoginForm({
  onSubmit: onSubmitProp,
  onSocialLogin,
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
    resolver: zodResolver(
      formConfig.schema,
    ) as unknown as Resolver<LoginCredentials>,
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
    } else {
      // Default behavior - log to console
      console.log("Login submitted:", { ...data, password: "***" });
      toast.success("Login form submitted! Check console for data.");
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Social Login Divider */}
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

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onSocialLogin?.("github")}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onSocialLogin?.("linkedin")}
        >
          <Icons.linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-sm underline underline-offset-4 hover:text-primary"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
