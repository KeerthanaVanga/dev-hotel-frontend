import { Outlet } from "react-router-dom";
import { Suspense } from "react";

const RootLayout = () => {
  return (
    <Suspense fallback="Loading...">
      <Outlet />
    </Suspense>
  );
};

export default RootLayout;
