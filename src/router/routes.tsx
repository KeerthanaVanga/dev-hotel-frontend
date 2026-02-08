import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";

const PublicRoute = lazy(() => import("./PublicRoute"));
const PrivateRoute = lazy(() => import("./PrivateRoute"));
const RootLayout = lazy(() => import("../layout/RootLayout"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CheckInPage = lazy(() => import("../pages/Check_In"));
const CheckOutPage = lazy(() => import("../pages/Check_Out"));
const CalenderPage = lazy(() => import("../pages/Calender"));
const InventoryPage = lazy(() => import("../pages/Inventory"));
const RoomsPage = lazy(() => import("../pages/Rooms"));
const RoomDetailsPage = lazy(
  () => import("../components/rooms/RoomDetailsPage"),
);
const RoomEditPage = lazy(() => import("../components/rooms/RoomFormPage"));
const UsersPage = lazy(() => import("../pages/Users"));
const BookingsPage = lazy(() => import("../pages/Bookings"));
const CreateBookingPage = lazy(() => import("../pages/CreateBooking"));
const PaymentsPage = lazy(() => import("../pages/Payments"));
const ReviewsPage = lazy(() => import("../pages/Reviews"));
const OffersPage = lazy(() => import("../pages/OffersPage"));
const OffersFormPage = lazy(() => import("../pages/OfferForm"));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthPage />,
            path: "/auth",
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "/checkin",
                element: <CheckInPage />,
              },
              {
                path: "/checkout",
                element: <CheckOutPage />,
              },
              {
                path: "/calender",
                element: <CalenderPage />,
              },
              {
                path: "/inventory",
                element: <InventoryPage />,
              },
              {
                path: "/rooms",
                children: [
                  {
                    index: true,
                    element: <RoomsPage />,
                  },
                  {
                    path: ":roomId",
                    element: <RoomDetailsPage />,
                  },
                  {
                    path: ":roomId/edit",
                    element: <RoomEditPage />,
                  },
                  {
                    path: "new",
                    element: <RoomEditPage />,
                  },
                ],
              },
              {
                path: "/users",
                element: <UsersPage />,
              },
              {
                path: "/bookings",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <BookingsPage />,
                  },
                  {
                    path: "new",
                    element: <CreateBookingPage />,
                  },
                ],
              },
              {
                path: "/offers",
                children: [
                  {
                    index: true,
                    element: <OffersPage />,
                  },
                  {
                    path: "new",
                    element: <OffersFormPage />,
                  },
                  {
                    path: ":offerId/edit",
                    element: <OffersFormPage />,
                  },
                ],
              },
              {
                path: "/payments",
                element: <PaymentsPage />,
              },
              {
                path: "/reviews",
                element: <ReviewsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
