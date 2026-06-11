import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return null; // or a spinner

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;