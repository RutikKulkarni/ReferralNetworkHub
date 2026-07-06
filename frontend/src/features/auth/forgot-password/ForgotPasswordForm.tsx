"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormRenderer } from "@/shared/utils/forms";
import { Button } from "@/components/ui/button";
import { FormField } from "@/shared/components/forms/molecules";
import { BaseInput } from "@/shared/components/forms/atoms";
import { Icons } from "@/components/icons";

import { defaultForgotPasswordData } from "./defaults";
import type { ForgotPasswordData } from "./model";
import {
  fieldTypeMappings,
  optionalFields,
  createSchemaOverrides,
  createFieldConfigurations,
  createFormSections,
} from "./config";

export interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordData) => Promise<void>;
}

export function ForgotPasswordForm({ onSubmit: onSubmitProp }: ForgotPasswordFormProps) {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const formConfig = createFormRenderer(defaultForgotPasswordData)
    .withFieldTypes(fieldTypeMappings)
    .withSchemaOverrides(createSchemaOverrides())
    .withOptionalFields(optionalFields)
    .withFieldConfigs(createFieldConfigurations())
    .withSections(createFormSections())
    .build();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(
      formConfig.schema,
    ) as unknown as Resolver<ForgotPasswordData>,
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="grid gap-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Icons.check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsSuccess(false)}
        >
          Back to form
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
