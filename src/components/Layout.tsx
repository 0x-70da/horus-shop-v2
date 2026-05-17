import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Layout;
