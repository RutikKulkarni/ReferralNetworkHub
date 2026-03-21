import { z } from "zod";

// @ts-expect-error - Zod v4 type compatibility issue
export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === "string") {
        return { message: "This field is required" };
      }
      if (issue.expected === "number") {
        return { message: "Please enter a valid number" };
      }
      return {
        message: `Expected ${issue.expected}, received ${issue.received}`,
      };

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        if (issue.minimum === 1) {
          return { message: "This field is required" };
        }
        return { message: `Must be at least ${issue.minimum} characters` };
      }
      if (issue.type === "number") {
        return { message: `Must be at least ${issue.minimum}` };
      }
      if (issue.type === "array") {
        return {
          message: `Please select at least ${issue.minimum} option${issue.minimum === 1 ? "" : "s"}`,
        };
      }
      break;

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: `Must be at most ${issue.maximum} characters` };
      }
      if (issue.type === "number") {
        return { message: `Must be at most ${issue.maximum}` };
      }
      if (issue.type === "array") {
        return {
          message: `Please select at most ${issue.maximum} option${issue.maximum === 1 ? "" : "s"}`,
        };
      }
      break;

    case z.ZodIssueCode.custom:
      return { message: issue.params?.message || ctx.defaultError };
  }

  return { message: ctx.defaultError };
};

export function setupZodValidation() {
  z.setErrorMap(customErrorMap);
}
