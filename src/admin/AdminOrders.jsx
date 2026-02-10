import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Clock, Truck, CheckCircle, XCircle, Trash2, AlertTriangle, User, Mail, Calendar } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // ID of order to delete
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      alert(`Order #${orderId} updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Check backend.");
    }
  };

  const deleteOrder = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/admin/orders/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o.orderId !== deleteId));
      setDeleteId(null);
      // Optional: show a custom toast here
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const statusInfo = (status) => {
    switch (status) {
      case "PLACED":
        return { label: "Order Placed", color: "bg-blue-100 text-blue-700", icon: Clock };
      case "SHIPPED":
        return { label: "In Transit", color: "bg-indigo-100 text-indigo-700", icon: Truck };
      case "DELIVERED":
        return { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "CANCELLED":
        return { label: "Rescinded", color: "bg-red-100 text-red-700", icon: XCircle };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700", icon: ShoppingBag };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 relative">

      {/* 🌟 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 uppercase">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium mt-1">Fulfill pending orders and manage customer purchases.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Volume</span>
            <span className="text-lg font-black text-gray-900 leading-none mt-1">{orders.length}</span>
          </div>
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center uppercase">
          <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
          <p className="text-xl font-black text-gray-300 tracking-tight uppercase">Your order queue is currently clear</p>
          <p className="text-gray-400 text-sm mt-1 font-medium uppercase">Sit back and relax while we wait for new luxury timepiece orders.</p>
        </div>
      ) : (
        <div className="grid gap-8 uppercase">
          {orders.map((order) => {
            const status = statusInfo(order.status);
            return (
              <div
                key={order.orderId}
                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden hover:border-purple-200 transition-all duration-300 group/card"
              >
                {/* Upper Section */}
                <div className="p-8 pb-4">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner group-hover/card:bg-purple-50 group-hover/card:text-purple-400 transition-colors">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-gray-900 uppercase">Order #{order.orderId}</h3>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 ${status.color}`}>
                            <status.icon size={12} />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <Calendar size={14} className="text-gray-300" />
                            {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="h-4 w-[1px] bg-gray-100 hidden sm:block" />
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 tracking-widest hover:text-purple-600 transition-colors cursor-default truncate max-w-[200px]">
                            <Mail size={14} className="text-gray-300" />
                            {order.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => setDeleteId(order.orderId)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 group/del"
                      title="Delete Order"
                    >
                      <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Order Items Table-style list */}
                  <div className="bg-[#fcfcff] rounded-3xl border border-gray-50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-3 bg-purple-400 rounded-full" />
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Purchased Artifacts</h4>
                    </div>
                    <div className="space-y-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group/item">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm shadow-gray-100 flex-shrink-0 group-hover/item:scale-105 transition-transform duration-300">
                              <img src={item.imageUrl || "/default-image.jpg"} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-800 tracking-tight uppercase">{item.productName}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 italic">Quantity: <span className="text-gray-900 not-italic">{item.quantity}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-gray-900 italic">₹{item.price?.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-purple-600 uppercase mt-0.5 tracking-tighter">Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats & Actions Area */}
                <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-10 bg-purple-600 rounded-full" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 leading-none italic">Settlement Total</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tighter mt-1 italic">₹{(order.totalAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <>
                        <button
                          onClick={() => updateStatus(order.orderId, "SHIPPED")}
                          className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-2xl bg-white text-indigo-600 border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-indigo-100 transition-all duration-300 flex items-center gap-2 group/btn"
                        >
                          <Truck size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                          Dispatch
                        </button>
                        <button
                          onClick={() => updateStatus(order.orderId, "DELIVERED")}
                          className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-2xl bg-white text-green-600 border border-green-100 shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-green-100 transition-all duration-300 flex items-center gap-2 group/btn"
                        >
                          <CheckCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                          Complete
                        </button>
                      </>
                    )}
                    {order.status !== "CANCELLED" && (
                      <button
                        onClick={() => updateStatus(order.orderId, "CANCELLED")}
                        className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-2xl bg-white text-red-400 border border-red-50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ⚠️ DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300 uppercase">
          <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500 text-center border border-red-50">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-inner">
              <AlertTriangle size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Confirm Removal</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed uppercase italic">Are you sure you want to delete <span className="text-red-600 font-black">Order #{deleteId}</span>? This action is permanent and cannot be reversed.</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="py-4 rounded-2xl bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={deleteOrder}
                disabled={deleting}
                className="py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-95"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
