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

import { defaultResetPasswordData } from "./defaults";
import type { ResetPasswordData } from "./model";
import {
  fieldTypeMappings,
  optionalFields,
  createSchemaOverrides,
  createFieldConfigurations,
  createFormSections,
} from "./config";

export interface ResetPasswordFormProps {
  onSubmit?: (data: ResetPasswordData) => Promise<void>;
}

export function ResetPasswordForm({ onSubmit: onSubmitProp }: ResetPasswordFormProps) {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const formConfig = createFormRenderer(defaultResetPasswordData)
    .withFieldTypes(fieldTypeMappings)
    .withSchemaOverrides(createSchemaOverrides())
    .withOptionalFields(optionalFields)
    .withFieldConfigs(createFieldConfigurations())
    .withSections(createFormSections())
    .build();

  // Add password match validation
  const schemaWithPasswordMatch = formConfig.schema.refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(
      schemaWithPasswordMatch,
    ) as unknown as Resolver<ResetPasswordData>,
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
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
          <h2 className="text-lg font-semibold">Password Reset Complete</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
        </div>
        <Link href="/login" className="w-full">
          <Button className="w-full">Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label={formConfig.fieldConfig.newPassword?.label || "New Password"}
          error={errors.newPassword?.message}
          required
        >
          <BaseInput
            {...register("newPassword")}
            type="password"
            placeholder={formConfig.fieldConfig.newPassword?.placeholder}
            error={!!errors.newPassword}
          />
        </FormField>

        <FormField
          label={
            formConfig.fieldConfig.confirmPassword?.label || "Confirm Password"
          }
          error={errors.confirmPassword?.message}
          required
        >
          <BaseInput
            {...register("confirmPassword")}
            type="password"
            placeholder={formConfig.fieldConfig.confirmPassword?.placeholder}
            error={!!errors.confirmPassword}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
