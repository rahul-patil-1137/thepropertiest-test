import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse, Property, PropertyFilters } from "@/types";

export function useProperties(filters: PropertyFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Property[]>>(
        `/properties?${params.toString()}`
      );
      return data;
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Property>>(`/properties/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useMyListings(page = 1) {
  return useQuery({
    queryKey: ["myListings", page],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Property[]>>(
        `/properties/agent/my-listings?page=${page}`
      );
      return data;
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<ApiResponse<Property>>("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data } = await api.put<ApiResponse<Property>>(
        `/properties/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse>(`/properties/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}
