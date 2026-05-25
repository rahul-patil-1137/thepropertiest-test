import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";
import type { ApiResponse, User, LoginPayload, RegisterPayload } from "@/types";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
        "/auth/login",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.data) {
        login(data.data.user, data.data.accessToken);
      }
    },
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
        "/auth/register",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.data) {
        login(data.data.user, data.data.accessToken);
      }
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: FormData | Partial<User>) => {
      const isFormData = payload instanceof FormData;
      const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const { data } = await api.put<ApiResponse<{ user: User }>>(
        "/auth/me", 
        payload,
        config
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data.user);
      }
    },
  });
}
