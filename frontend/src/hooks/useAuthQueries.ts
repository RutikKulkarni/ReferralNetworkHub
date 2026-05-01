import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api, { setAccessToken, clearAccessToken } from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponseData,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types/auth.types";

/**
 * Helper to format error messages from API response
 */
function formatApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiResponse | undefined;

    // Check for errors array (validation errors)
    if (apiError?.errors && Array.isArray(apiError.errors)) {
      return apiError.errors.join("\n");
    }

    // Check for single error string
    if (apiError?.error) {
      return apiError.error;
    }

    // Check for message
    if (apiError?.message) {
      return apiError.message;
    }
  }

  return "An unexpected error occurred";
}

/**
 * Login Mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const { data } = await api.post<ApiResponse<AuthResponseData>>(
          "/auth/login",
          credentials,
        );

        if (!data.success || !data.data) {
          throw new Error(data.error || "Login failed");
        }

        return data.data;
      } catch (error) {
        throw new Error(formatApiError(error));
      }
    },
    onSuccess: (data: AuthResponseData) => {
      // Store access token in memory
      setAccessToken(data.accessToken);

      // Store user in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(data.user));

      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
}

/**
 * Register Mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      try {
        const { data } = await api.post<ApiResponse<AuthResponseData>>(
          "/auth/register",
          userData,
        );

        if (!data.success || !data.data) {
          throw new Error(data.error || "Registration failed");
        }

        return data.data;
      } catch (error) {
        throw new Error(formatApiError(error));
      }
    },
    onSuccess: (data: AuthResponseData) => {
      // Store access token in memory
      setAccessToken(data.accessToken);

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Invalidate user query
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
}

/**
 * Logout Mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with local cleanup even if API call fails
      }
    },
    onSuccess: () => {
      // Clear access token
      clearAccessToken();

      // Clear localStorage
      localStorage.removeItem("user");

      // Clear all queries
      queryClient.clear();
    },
  });
}

/**
 * Refresh Token Mutation
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
        "/auth/refresh-token",
      );

      if (!data.success || !data.data?.accessToken) {
        throw new Error("Token refresh failed");
      }

      return data.data.accessToken;
    },
    onSuccess: (accessToken: string) => {
      setAccessToken(accessToken);
    },
  });
}

/**
 * Get Current User Query
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>("/auth/me");

      if (!data.success || !data.data) {
        throw new Error("Failed to fetch user");
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.data));

      return data.data;
    },
    enabled: false, // Only fetch via refetch() — prevents 401 cascade on public pages
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if 401
  });
}
