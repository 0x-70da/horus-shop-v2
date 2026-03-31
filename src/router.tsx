import { createBrowserRouter } from "react-router-dom";
import GuestGuard from "./features/auth/components/guest.protect";
import Layout from "./components/Layout";
import LoginPage from "./features/auth/pages/login.page";
import RegisterPage from "./features/auth/pages/register.page";

export const router = createBrowserRouter([
    {
        // element: <GuestGuard />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ]
    },

    // {
    //     path: "/",
    //     element: <Layout />,
    //     children: [
    //         { index: true, element: <HomePage /> },
    //         { path: "products", element: <ProductsPage /> },
    //     ]
    // }
])