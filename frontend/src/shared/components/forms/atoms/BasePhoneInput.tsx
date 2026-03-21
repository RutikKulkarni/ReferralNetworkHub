"use client";

import * as React from "react";
import { PhoneInput } from "@/components/ui/phone-input";
import type { PhoneFieldConfig } from "@/shared/types/forms";

export interface BasePhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  defaultCountry?: string;
  disabled?: boolean;
  error?: boolean;
  config?: PhoneFieldConfig;
  className?: string;
}

export const BasePhoneInput = React.forwardRef<
  HTMLInputElement,
  BasePhoneInputProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultCountry = "US",
      disabled,
      className,
    },
    ref,
  ) => {
    return (
      <PhoneInput
        ref={ref}
        value={value}
        onChange={
          onChange as
            | ((e: React.ChangeEvent<HTMLInputElement>) => void)
            | undefined
        }
        placeholder={placeholder}
        defaultCountry={defaultCountry}
        disabled={disabled}
        className={className}
      />
    );
  },
);

BasePhoneInput.displayName = "BasePhoneInput";
