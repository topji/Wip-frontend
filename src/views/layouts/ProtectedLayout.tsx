import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default ProtectedLayout;
