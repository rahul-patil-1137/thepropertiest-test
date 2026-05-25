import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse, Enquiry, EnquiryPayload } from "@/types";

export function useCreateEnquiry() {
  return useMutation({
    mutationFn: async (payload: EnquiryPayload) => {
      const { data } = await api.post<ApiResponse<Enquiry>>("/enquiries", payload);
      return data;
    },
  });
}

export function useMyEnquiries(page = 1, status?: string) {
  return useQuery({
    queryKey: ["myEnquiries", page, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set("status", status);
      const { data } = await api.get<ApiResponse<Enquiry[]>>(
        `/enquiries/my?${params.toString()}`
      );
      return data;
    },
  });
}

export function useUpdateEnquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put<ApiResponse<Enquiry>>(
        `/enquiries/${id}/status`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myEnquiries"] });
    },
  });
}
