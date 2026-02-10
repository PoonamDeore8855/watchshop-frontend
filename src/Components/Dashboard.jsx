import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Package, Heart, LogOut, ChevronRight, ShoppingBag, Clock, CheckCircle, AlertCircle, CreditCard } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function Dashboard() {
  const [active, setActive] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();

  let user = null;
  try {
    const rawUser = localStorage.getItem("user");
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (err) {
    console.error("Error parsing user data:", err);
  }
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("admin");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (active === "orders" && token) {
      setLoading(true);
      axios
        .get("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load orders", err);
          setLoading(false);
        });
    }
  }, [active, token]);

  useEffect(() => {
    if (active === "payments" && token) {
      setLoading(true);
      axios
        .get("/api/transactions/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTransactions(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load transactions", err);
          setLoading(false);
        });
    }
  }, [active, token]);

  const StatusBadge = ({ status }) => {
    const isPaid = status === "PAID" || status === "DELIVERED";
    const isPending = status === "PENDING" || status === "PLACED";

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit mx-auto
        ${isPaid ? "bg-green-100 text-green-700" : isPending ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
      >
        {status || "PENDING"}
      </span>
    );
  };

  const handleDownloadInvoice = (orderId) => {
    const token = localStorage.getItem("token");
    // We append the token as a query param because standard anchor tag download
    // doesn't support Authorization headers easily without a blob download.
    // The backend InvoiceController doesn't support token in query param by default
    // but we can try to use a blob fetch if query param is not preferred.
    // For now, let's try a direct link if the backend security allows token in query (unlikely without config).
    // Alternative: 
    axios.get(`/api/invoices/order/${orderId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch(err => {
      console.error("Download failed", err);
      alert("Invoice not ready or download failed.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 🚀 PREMIUM HEADER HERO */}
      <div className="pt-32 pb-20 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 shadow-2xl skew-y-[-1deg] -mt-10">
        <div className="max-w-7xl mx-auto px-6 skew-y-[1deg]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl border border-white/30 shadow-xl">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-white tracking-tight">
                Welcome Back, {user?.username || "Guest"}!
              </h1>
              <p className="text-purple-100 mt-2 font-medium opacity-80">
                Manage your profile, view history, and track your premium timepieces.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* 🛠 SIDEBAR MENU */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-28">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dashboard Menu</p>
              </div>

              <nav className="p-2 space-y-1">
                {[
                  { id: "profile", label: "My Profile", icon: User },
                  { id: "orders", label: "Order History", icon: Package },
                  { id: "payments", label: "Transaction History", icon: CreditCard },
                  { id: "wishlist", label: "Wishlist", icon: Heart, link: "/wishlist" },
                ].map((item) => (
                  item.link ? (
                    <Link key={item.id} to={item.link} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all group">
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                        {item.label}
                      </div>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActive(item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-all group
                        ${active === item.id
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={`${active === item.id ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                        {item.label}
                      </div>
                      <ChevronRight size={14} className={`${active === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
                    </button>
                  )
                ))}

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                  >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Sign Out Account
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* 📄 MAIN CONTENT AREA */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 min-h-[500px] overflow-hidden">

              {active === "profile" && (
                <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-2 bg-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                      <p className="text-lg font-black text-gray-900">{user?.username}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                      <p className="text-lg font-black text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 text-center flex flex-col items-center justify-center">
                      <Package className="text-purple-600 mb-4" size={32} />
                      <span className="text-3xl font-black text-purple-700">{orders.length}</span>
                      <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Total Orders</span>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl border border-pink-100 text-center flex flex-col items-center justify-center">
                      <Heart className="text-pink-600 mb-4" size={32} />
                      <span className="text-sm font-bold text-pink-700 uppercase tracking-widest">Active Wishlist</span>
                      <Link to="/wishlist" className="text-xs font-bold text-pink-500 underline mt-2 hover:text-pink-700">View Saved Watches</Link>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 text-center flex flex-col items-center justify-center">
                      <ShoppingBag className="text-blue-600 mb-4" size={32} />
                      <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Recent Purchases</span>
                      <button onClick={() => setActive("orders")} className="text-xs font-bold text-blue-500 underline mt-2 hover:text-blue-700">Track Orders</button>
                    </div>
                  </div>
                </div>
              )}

              {active === "orders" && (
                <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-2 bg-indigo-600 rounded-full"></div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Timeline</h2>
                    </div>
                    <span className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-500">
                      {orders.length} total orders
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-500 font-bold">Synchronizing history...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-xl font-bold text-gray-400">Your collection is empty</p>
                      <Link to="/watches" className="mt-4 inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-black hover:bg-purple-700 transition-all shadow-lg">
                        Explore Watches
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Order Status</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.map((o) => (
                            <React.Fragment key={o.orderId}>
                              <tr className="hover:bg-purple-50/30 transition-colors">
                                <td className="px-6 py-6 text-sm font-black text-gray-900">#{o.orderId}</td>
                                <td className="px-6 py-6 text-sm font-black text-purple-700 text-center">₹{o.totalAmount?.toLocaleString()}</td>
                                <td className="px-6 py-6 text-center">
                                  <StatusBadge status={o.status} />
                                </td>
                                <td className="px-6 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleDownloadInvoice(o.orderId)}
                                      className="px-3 py-1.5 bg-purple-100 text-purple-700 text-[10px] uppercase font-bold rounded-lg hover:bg-purple-200 transition-all"
                                    >
                                      Invoice
                                    </button>
                                    <button
                                      onClick={() => setSelectedOrderId(o.orderId)}
                                      className="px-4 py-1.5 text-[10px] uppercase font-black rounded-lg transition-all bg-gray-900 text-white hover:bg-purple-700"
                                    >
                                      Show Items
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {active === "payments" && (
                <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-2 bg-pink-600 rounded-full"></div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Transaction History</h2>
                    </div>
                    <span className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-500">
                      {transactions.length} transactions
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-500 font-bold">Retrieving ledger...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-xl font-bold text-gray-400">No payment records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Method</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Date & Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-pink-50/30 transition-colors">
                              <td className="px-6 py-6 text-sm font-black text-gray-900">#{t.orderId}</td>
                              <td className="px-6 py-6 text-sm font-black text-pink-700 text-center">₹{t.amount?.toLocaleString()}</td>
                              <td className="px-6 py-6 text-center">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                  {t.paymentMethod}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {t.paymentStatus}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-right text-xs font-bold text-gray-400 uppercase">
                                {new Date(t.transactionDate).toLocaleDateString()} {new Date(t.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* 💎 PREMIUM ORDER DETAILS MODAL */}
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
