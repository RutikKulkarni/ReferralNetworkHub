"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { useForm, useWatch, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormRenderer } from "@/shared/utils/forms";
import { Button } from "@/components/ui/button";
import { FormField } from "@/shared/components/forms/molecules";
import {
  BaseInput,
  BaseTextarea,
  BaseSelect,
} from "@/shared/components/forms/atoms";

import { defaultContactFormData } from "./defaults";
import type { ContactFormData } from "./model";
import {
  fieldTypeMappings,
  optionalFields,
  createSchemaOverrides,
  createFieldConfigurations,
  createFormSections,
  SUBJECT_OPTIONS,
} from "./config";

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  defaultValues?: Partial<ContactFormData>;
  disabled?: boolean;
}

export function ContactForm({
  onSubmit: onSubmitProp,
  defaultValues,
  disabled = false,
}: ContactFormProps) {
  const formConfig = createFormRenderer({
    ...defaultContactFormData,
    ...defaultValues,
  })
    .withFieldTypes(fieldTypeMappings)
    .withSchemaOverrides(createSchemaOverrides())
    .withOptionalFields(optionalFields)
    .withFieldConfigs(createFieldConfigurations())
    .withSections(createFormSections())
    .build();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(
      formConfig.schema,
    ) as unknown as Resolver<ContactFormData>,
    defaultValues: formConfig.defaultValues,
  });

  const subjectValue = useWatch({ control, name: "subject" });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
    } else {
      console.log("Contact form submitted:", data);
      toast.success("Message sent! We'll get back to you soon.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={formConfig.fieldConfig.firstName?.label || "First Name"}
          error={errors.firstName?.message}
          required
        >
          <BaseInput
            {...register("firstName")}
            placeholder={
              formConfig.fieldConfig.firstName?.placeholder as string
            }
            error={!!errors.firstName}
            disabled={disabled}
          />
        </FormField>

        <FormField
          label={formConfig.fieldConfig.lastName?.label || "Last Name"}
          error={errors.lastName?.message}
          required
        >
          <BaseInput
            {...register("lastName")}
            placeholder={
              formConfig.fieldConfig.lastName?.placeholder as string
            }
            error={!!errors.lastName}
            disabled={disabled}
          />
        </FormField>
      </div>

      <FormField
        label={formConfig.fieldConfig.email?.label || "Email"}
        error={errors.email?.message}
        required
      >
        <BaseInput
          {...register("email")}
          type="email"
          placeholder={formConfig.fieldConfig.email?.placeholder as string}
          error={!!errors.email}
          disabled={disabled}
        />
      </FormField>

      <FormField
        label={formConfig.fieldConfig.subject?.label || "Subject"}
        error={errors.subject?.message}
        required
      >
        <BaseSelect
          value={subjectValue}
          onValueChange={(value) => setValue("subject", value, { shouldValidate: true })}
          options={SUBJECT_OPTIONS}
          placeholder="Select a subject"
          disabled={disabled}
        />
      </FormField>

      <FormField
        label={formConfig.fieldConfig.message?.label || "Message"}
        error={errors.message?.message}
        required
      >
        <BaseTextarea
          {...register("message")}
          rows={5}
          placeholder={formConfig.fieldConfig.message?.placeholder as string}
          error={!!errors.message}
          disabled={disabled}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting || disabled}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
