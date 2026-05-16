import { createBrowserRouter } from "react-router-dom";
import GuestGuard from "./features/auth/components/guest.guard";
import Layout from "./components/Layout";
import LoginPage from "./features/auth/pages/login.page";
import RegisterPage from "./features/auth/pages/register.page";
import AuthGuard from "./features/auth/components/auth.guard";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./features/categories/categories.page";
import ProductsPage from "./features/products/products.page";
import CartPage from "./features/cart/cart.page";
import ProfilePage from "./features/users/pages/profile.page";
import WishlistPage from "./features/wishlist/wishlist.page";
import ForgotPasswordPage from "./features/auth/pages/forgot-password.page";
import VerifyCodePage from "./features/auth/pages/verify-code.page";
import ResetPasswordPage from "./features/auth/pages/reset-password.page";
import ProductDetailsPage from "./features/products/product-details.page";
import OrdersPage from "./features/orders/orders.page";
import OrderDetailsPage from "./features/orders/order-details.page";
import CheckoutPage from "./features/orders/checkout.page";
import CheckoutPaymentPage from "./features/payments/checkout.payment.page";
import CheckoutPaymentStatusPage from "./features/payments/checkout.payment.status.page";
import AddressesPage from "./features/addresses/address.page";

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/verify-code", element: <VerifyCodePage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "category/:id", element: <CategoriesPage /> },
    ],
  },

  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "wishlist", element: <WishlistPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:orderId", element: <OrderDetailsPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "checkout/payment", element: <CheckoutPaymentPage /> },
          {
            path: "checkout/payment/status",
            element: <CheckoutPaymentStatusPage />,
          },
          { path: "profile/addresses", element: <AddressesPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
