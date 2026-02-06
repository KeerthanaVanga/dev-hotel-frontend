import { Navigate, Outlet, useNavigation } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import ROUTES from "./path.route";
import GlobalLoader from "../components/ui/GlobalLoader";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigation = useNavigation();

  if (loading || navigation.state === "loading") return <GlobalLoader />;

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <Suspense fallback={<GlobalLoader />}>
      <Outlet />
    </Suspense>
  );
};

export default PublicRoute;
