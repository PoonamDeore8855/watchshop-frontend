import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Mail, Shield, Trash2, History, X, Search, ChevronRight, Hash, User, UserCheck, UserPlus, Star } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  // ✅ Token for authentication
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchUsers();
  }, [adminToken]);

  const fetchUsers = async () => {
    if (!adminToken) return;
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await axios.put(`/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      // Optional: show a custom toast
    } catch (err) {
      console.error("Error toggling role:", err);
      alert("Failed to update role.");
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      setFetchingOrders(true);
      const res = await axios.get(`/api/admin/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSelectedUserOrders({ userId, orders: res.data });
    } catch (err) {
      console.error("Error fetching user orders:", err);
      alert("Failed to fetch order history.");
    } finally {
      setFetchingOrders(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "ADMIN").length,
    customers: users.filter(u => u.role === "USER" || !u.role).length
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 uppercase">

      {/* 🌟 HEADER & STATS */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Directory</h1>
            <p className="text-gray-500 font-medium mt-1 uppercase italic">Audit registered users and manage administrative privileges.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black shadow-sm focus:ring-4 focus:ring-purple-50 transition-all outline-none w-full md:w-96 uppercase tracking-widest italic"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Accounts", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Admins", value: stats.admins, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Boutique Customers", value: stats.customers, icon: Star, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1 leading-none italic">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👥 USERS TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Account Contacts</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-center">Privileges</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                      <Users size={40} />
                    </div>
                    <p className="text-xl font-black text-gray-300 uppercase italic">No registered users matched your criteria</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-purple-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-black text-lg border border-white shadow-inner group-hover:scale-110 transition-transform">
                          {u.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 tracking-tight uppercase">{u.username || "Anonymous"}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                            <Hash size={10} className="text-gray-300" />
                            UID: {u.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-tight lowercase">
                          <Mail size={12} className="text-purple-400" />
                          {u.email}
                        </div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">Verified Member</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        disabled={u.id === 1}
                        className={`inline-flex items-center gap-1.5 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest border shadow-sm transition-all active:scale-95
                        ${u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
                            : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"}`}
                      >
                        <Shield size={12} />
                        {u.role || "USER"}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => fetchUserOrders(u.id)}
                          className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-purple-600 hover:text-white hover:rotate-6 transition-all duration-300 border border-gray-100 shadow-sm"
                          title="Review History"
                        >
                          <History size={18} />
                        </button>
                        <button
                          disabled={u.id === 1 || u.role === "ADMIN"}
                          onClick={() => deleteUser(u.id)}
                          className={`p-3 rounded-2xl transition-all duration-300 border shadow-sm ${u.id === 1 || u.role === "ADMIN"
                            ? "text-gray-100 bg-gray-50 border-gray-50 cursor-not-allowed opacity-50"
                            : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-red-600 hover:text-white hover:-rotate-6 hover:border-red-600"}`}
                          title="Terminate Account"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🎭 ORDER HISTORY MODAL */}
      {selectedUserOrders && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300 uppercase italic">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                  <History size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Purchase History</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Audit for User: #{selectedUserOrders.userId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserOrders(null)}
                className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 bg-white">
              {fetchingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Retrieving Vault Data...</p>
                </div>
              ) : selectedUserOrders.orders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-100">
                    <Package size={40} />
                  </div>
                  <p className="text-xl font-black text-gray-300 uppercase italic">No transaction logs available</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {selectedUserOrders.orders.map(order => (
                    <div key={order.orderId} className="bg-[#fcfcff] rounded-[2.5rem] p-8 border border-gray-50 hover:border-purple-100 transition-colors group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 bg-purple-600 rounded-full group-hover:scale-y-125 transition-transform" />
                          <div>
                            <p className="text-sm font-black text-gray-900">Archive #{order.orderId}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm
                          ${order.status === "DELIVERED" ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"}
                        `}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-4 mb-6 relative z-10">
                        {order.items?.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-xs border-b border-gray-100 pb-3 last:border-0 last:pb-0 italic">
                            <span className="text-gray-600 font-bold uppercase">{item.productName} × <span className="text-purple-600 not-italic">{item.quantity}</span></span>
                            <span className="font-black text-gray-900 tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex justify-between items-center relative z-10 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Settled</span>
                        <span className="text-xl font-black text-purple-700 tracking-tighter">₹{order.totalAmount?.toLocaleString()}</span>
                      </div>

                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 opacity-0 group-hover:opacity-30 rounded-bl-full transition-opacity -mr-10 -mt-10" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
