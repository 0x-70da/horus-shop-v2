import { Route, Routes } from "react-router-dom";
import "@/App.css";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Home</h1>} />
          {/* <Route path="products" element={<Products />} /> */}
          {/* <Route path="product/:slug" element={<ProductDetails />} /> */}
          {/* <Route path="category/:slug" element={<Category />} /> */}
          {/* <Route path="cart" element={<Cart />} /> */}
          {/* <Route path="wishlist" element={<Wishlist />} /> */}
          {/* <Route path="orders" element={<Orders />} /> */}
          {/* <Route path="profile" element={<Profile />} /> */}
          {/* <Route path="search" element={<Search />} /> */}
          {/* <Route path="login" element={<Login />} /> */}
          {/* <Route path="register" element={<Register />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
