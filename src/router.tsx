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
            ]
          }
        ]
    },

    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "category/:slug", element: <CategoriesPage /> },
        ]
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
                    { path: "orders", element: <p>Orders Page</p> },
                    { path: "profile", element: <ProfilePage /> },
                ]
            }
        ]
    },

    { path: "*", element: <NotFound /> }
]);