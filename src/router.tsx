import { createBrowserRouter } from "react-router-dom";
import GuestGuard from "./features/auth/components/guest.guard";
import Layout from "./components/Layout";
import LoginPage from "./features/auth/pages/login.page";
import RegisterPage from "./features/auth/pages/register.page";
import AuthGuard from "./features/auth/components/auth.guard";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
    {
        element: <GuestGuard />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ]
    },

    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "products", element: <p>Products Page</p> },
        ]
    },

    {
        element: <AuthGuard />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    { path: "cart", element: <p>Cart Page</p> },
                    { path: "orders", element: <p>Orders Page</p> },
                    { path: "profile", element: <p>Profile Page</p> },
                ]
            }
        ]
    },

    { path: "*", element: <NotFound /> }
]);