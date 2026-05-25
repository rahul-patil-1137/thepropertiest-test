import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface RoleGuardProps {
  role: string;
  children: React.ReactNode;
}

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
