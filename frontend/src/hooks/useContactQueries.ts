import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/auth.types";
import type { ContactFormData } from "@/features/contact/model";

/**
 * Helper to format error messages from API response
 */
function formatApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiResponse | undefined;

    if (apiError?.errors && Array.isArray(apiError.errors)) {
      return apiError.errors.join("\n");
    }

    if (apiError?.error) {
      return apiError.error;
    }

    if (apiError?.message) {
      return apiError.message;
    }
  }

  return "An unexpected error occurred";
}

/**
 * Send Contact Message Mutation
 */
export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      try {
        const { data } = await api.post<ApiResponse<{ message: string }>>(
          "/contact",
          formData,
        );

        if (!data.success) {
          throw new Error(data.error || "Failed to send message");
        }

        return data.message;
      } catch (error) {
        throw new Error(formatApiError(error));
      }
    },
  });
}
