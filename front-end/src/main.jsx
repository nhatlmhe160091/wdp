import { createRoot } from 'react-dom/client';
import RoleBasedLayout from './layouts/roleBasedLayout';
import { AuthProvider } from './contexts/authContext';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';
import TableManager from './pages/manager/table/TableManager';
import { Home, Dish, Restaurant, Unauthorized, Voucher, InvalidRequest, RestaurantDetail, SignOut, VerificationSuccess } from './pages/general/index'
import BookingList from './pages/manager/booking/BookingList';
import TableList from './pages/manager/table/TableList';
import DiningTableStatus from './pages/manager/table/TableStatus';
import AssignTableTime from './pages/manager/table/AssignTableTime';
import UserList from './pages/admin/user/UserList';
import "./input.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RestaurantManager from "./pages/admin/restaurant/RestaurantManager";
import DishManager from "./pages/admin/dish/DishManager";
import Support from './pages/support/Support';
/**
 * Roles include GUEST, CUSTOMER, STAFF, ADMIN, MANAGER
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleBasedLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: "sign-out",
        element: (
          <ProtectedRoute>
            <SignOut />,
          </ProtectedRoute>
        )
      },
      {
        path: "dish",
        element: (
          <ProtectedRoute requiredRoles={['GUEST', 'CUSTOMER']}>
            <Dish />
          </ProtectedRoute>
        )
      },
      {
        path: "/restaurant/:id",
        element: (
          <ProtectedRoute requiredRoles={['GUEST', 'CUSTOMER']}>
            <RestaurantDetail />
          </ProtectedRoute>
        )
      },
      {
        path: "restaurant",
        element: (
          <ProtectedRoute requiredRoles={['GUEST', 'CUSTOMER']}>
            <Restaurant />
          </ProtectedRoute>
        ),
      },
      {
        path: "voucher",
        element: (
          <ProtectedRoute requiredRoles={['GUEST', 'CUSTOMER']}>
            <Voucher />
          </ProtectedRoute>
        )
      },
      {
        path: "support",
        element: (
          <ProtectedRoute requiredRoles={['GUEST', 'CUSTOMER']}>
            <Support />
          </ProtectedRoute>
        )
      },
      {
        path: "manager",
        children: [
          {
            path: "table-manager",
            element: (
              <ProtectedRoute requiredRoles={['MANAGER']}>
                <TableManager />
              </ProtectedRoute>
            ),
          },
          {
            path: "booking-list",
            element: (
              <ProtectedRoute requiredRoles={['MANAGER']}>
                <BookingList />
              </ProtectedRoute>
            ),
          },
          {
            path: "table-list",
            element: (
              <ProtectedRoute requiredRoles={['MANAGER']}>
                <TableList />
              </ProtectedRoute>
            ),
          }
          ,
          {
            path: "booking-table",
            element: (
              <ProtectedRoute requiredRoles={['MANAGER']}>
                <AssignTableTime />
              </ProtectedRoute>
            ),
          },
          {
            path: "table-status",
            element: (
              <ProtectedRoute requiredRoles={['MANAGER']}>
                <DiningTableStatus />
              </ProtectedRoute>
            ),
          },
          {
            path: "user-list",
            element: (
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: "admin",
        children: [
          {
            path: "dish",
            element: (
              <ProtectedRoute requiredRoles={["ADMIN"]}>
                <DishManager />
              </ProtectedRoute>
            ),
          },
          {
            path: "restaurant",
            element: (
              <ProtectedRoute requiredRoles={["ADMIN"]}>
                <RestaurantManager />
              </ProtectedRoute>
            ),
          },
          {
            path: "user-list",
            element: (
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: "unauthorized",
        element: (
          <ProtectedRoute>
            <Unauthorized />
          </ProtectedRoute>
        ),
      },
      {
        path: "invalid",
        element: (
          <ProtectedRoute>
            <InvalidRequest />
          </ProtectedRoute>
        ),
      },
      {
        path: "verification-success",
        element: (
          <ProtectedRoute>
            <VerificationSuccess />
          </ProtectedRoute>
        ),
      }
    ],
  },


]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer position="top-right" autoClose={3000} />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);
