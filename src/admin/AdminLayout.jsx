import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Package, LogOut, ArrowLeft, Menu, X, Home, BarChart3, Ticket, CreditCard } from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Payment History", path: "/admin/transactions", icon: CreditCard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Coupons", path: "/admin/coupons", icon: Ticket },
  ];

  const adminEmail = localStorage.getItem("adminEmail") || "Admin";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* 📱 MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🛡️ SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-gradient-to-b from-[#1e1b4b] to-[#312e81] text-white z-50 transform transition-transform duration-300 lg:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter">WATCHSHOP</h1>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all group
                  ${location.pathname === item.path
                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                <item.icon size={18} className={`${location.pathname === item.path ? "text-purple-400" : "group-hover:text-purple-300"}`} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-6 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-bold text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 📄 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 🎩 TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 lg:hidden text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
              <span>Admin</span>
              <span className="text-gray-200">/</span>
              <span className="text-gray-900">{menuItems.find(m => m.path === location.pathname)?.name || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* 🏠 GO TO HOME (Back Arrow) */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-black text-xs uppercase hover:bg-purple-100 transition-all shadow-sm border border-purple-100 group"
              title="Go to Home"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <Home size={16} className="lg:hidden" />
              <span className="hidden lg:inline">Go to Home</span>
            </Link>

            <div className="h-8 w-[1px] bg-gray-100" />

            <Link to="/admin/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-2xl transition-all cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">System Admin</p>
                <p className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">{adminEmail}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-black group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* 🍿 CONTENT VIEWPORT */}
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
