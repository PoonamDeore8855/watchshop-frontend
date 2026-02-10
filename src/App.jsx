import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Main from "./Components/Main";
import Login from "./Components/Login";
import Contact from "./Components/Contact";
import Brands from "./Components/Brands";
import Collections from "./Components/Collections";
import Sale from "./Components/Sale";
import Watches from "./Components/Watches";
import WatchDetails from "./Components/WatchDetails";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";
import MyOrders from "./Components/MyOrders";
import Checkout from "./Components/Checkout";
import OrderSuccess from "./Components/OrderSuccess";

//admin panel
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminUsers from "./admin/AdminUsers";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminProfile from "./admin/AdminProfile";
import AdminCoupons from "./admin/AdminCoupons";
import AdminTransactions from "./admin/AdminTransactions";


function Layout() {
  const location = useLocation();
  // Hide main navbar for admin panel or specific pages if needed
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Main />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watches" element={<Watches />} />
        <Route path="/watchdetails" element={<WatchDetails />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}