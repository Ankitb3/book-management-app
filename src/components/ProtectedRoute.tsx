import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {  isSignedIn } = useUser();
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
