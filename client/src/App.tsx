import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ListingsPage from "@/pages/ListingsPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import AgentDashboardPage from "@/pages/AgentDashboardPage";
import AddListingPage from "@/pages/AddListingPage";
import EditListingPage from "@/pages/EditListingPage";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

            {/* Agent-only routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard role="agent">
                    <AgentDashboardPage />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-listing"
              element={
                <ProtectedRoute>
                  <RoleGuard role="agent">
                    <AddListingPage />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-listing/:id"
              element={
                <ProtectedRoute>
                  <RoleGuard role="agent">
                    <EditListingPage />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
