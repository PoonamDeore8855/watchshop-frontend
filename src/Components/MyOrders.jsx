import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Package,
  ChevronRight,
  Download,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Navigation,
  FileText,
  ShoppingBag
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your archive 🔒");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // API returns recent orders first usually, but we can reverse if needed.
      setOrders(res.data.reverse());
    } catch (err) {
      console.error(err);
      setError("Failed to synchronize with the vault ❌");
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    'PLACED': { label: 'Settled', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock, progress: 33 },
    'SHIPPED': { label: 'In Transit', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Truck, progress: 66 },
    'DELIVERED': { label: 'Legacy Piece', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle, progress: 100 },
    'CANCELLED': { label: 'Rescinded', color: 'text-red-500', bg: 'bg-red-50', icon: XCircle, progress: 0 },
  };

  if (loading) {
    return (
      <div className="pt-40 min-h-screen flex flex-col items-center gap-4 bg-[#fdfdfd]">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Retrieving Personal Archive</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 min-h-screen text-center bg-[#fdfdfd] px-6">
        <div className="max-w-md mx-auto p-12 bg-white rounded-[3rem] border border-red-50 shadow-2xl shadow-red-100/20">
          <XCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-4">Protocol Error</h2>
          <p className="text-gray-500 font-bold text-sm uppercase italic leading-loose mb-8">{error}</p>
          <Link to="/login" className="inline-flex px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
            Authentication Required
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcff] pt-40 pb-32 px-6 uppercase italic">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* 🌟 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black tracking-widest mb-4 border border-purple-100 uppercase">
              <ShoppingBag size={12} />
              Ownership History
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">My Collection</h1>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] mt-2 italic">A curated archive of your acquired luxury timepieces and their status.</p>
          </div>

          {orders.length > 0 && (
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-300 tracking-widest mb-1 italic">Total Acquisitions</p>
              <p className="text-3xl font-black text-gray-900 leading-none">{orders.length}</p>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-inner">
              <Navigation size={40} className="rotate-45" />
            </div>
            <h2 className="text-2xl font-black text-gray-300 uppercase tracking-tight italic mb-2">Your Archive is Waiting</h2>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] italic mb-10">Discover our exclusive collections and establish your legacy.</p>
            <Link to="/" className="inline-flex px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:-translate-y-1 transition-all shadow-2xl shadow-gray-200 active:scale-95 group">
              Browse Collections
              <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-12">
            {orders.map((order, idx) => {
              const status = statusMap[order.status] || { label: order.status || 'Processing', color: 'text-gray-600', bg: 'bg-gray-50', icon: Clock, progress: 10 };

              return (
                <div
                  key={order.orderId}
                  className="group relative animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Glassmorphic Card */}
                  <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl shadow-gray-200/50 overflow-hidden hover:shadow-gray-300 transition-all duration-500 hover:-translate-y-1">

                    {/* Upper Metadata Section */}
                    <div className="p-10 pb-6 flex flex-wrap justify-between items-start gap-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[80px] opacity-30 -mr-20 -mt-20 group-hover:bg-indigo-50 transition-colors duration-1000" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Archive ID: #{order.orderId}</h3>
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-white/50 shadow-sm ${status.bg} ${status.color}`}>
                            <status.icon size={12} />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs font-black text-gray-400 tracking-[0.2em] italic">Established : {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>

                      <div className="relative z-10 text-right">
                        <p className="text-[10px] font-black text-gray-300 tracking-widest mb-1 italic uppercase">Settlement Amount</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">₹{(order.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="px-10 py-8 border-y border-gray-100 bg-gray-50/30 relative">
                      <div className="flex items-center justify-between mb-4 px-2">
                        {['PLACED', 'SHIPPED', 'DELIVERED'].map((step, i) => {
                          const steps = ['PLACED', 'SHIPPED', 'DELIVERED'];
                          const currentIdx = steps.indexOf(order.status);
                          const isPast = i < currentIdx;
                          const isCurrent = i === currentIdx;

                          return (
                            <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-1000 border-2 
                                ${isPast ? 'bg-purple-600 text-white border-purple-600' : isCurrent ? 'bg-white text-purple-600 border-purple-600 ring-4 ring-purple-50' : 'bg-white text-gray-200 border-gray-100'}`}>
                                {isPast ? <CheckCircle size={14} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                              </div>
                              <span className={`text-[9px] font-black tracking-widest uppercase italic 
                                ${isPast || isCurrent ? 'text-gray-900' : 'text-gray-300'}`}>
                                {step === 'PLACED' ? 'Secured' : step === 'SHIPPED' ? 'Sent' : 'Legacy'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute top-[52px] left-20 right-20 h-[2px] bg-gray-100 -z-0">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                          style={{ width: `${status.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Artifacts List */}
                    <div className="p-10 space-y-6">
                      <div className="flex items-center gap-3 italic">
                        <div className="w-1 h-3 bg-gray-200 rounded-full" />
                        <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">Contents of this transmission</span>
                      </div>

                      <div className="grid gap-4">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white/50 border border-gray-100/50 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group/item">
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner group-hover/item:scale-105 transition-transform duration-500">
                                <img src={item.imageUrl || "/default-image.jpg"} className="w-full h-full object-cover grayscale-[30%] group-hover/item:grayscale-0 transition-all duration-700" alt="" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-base font-black text-gray-900 italic tracking-tight uppercase leading-none">{item.productName}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Quantity: <span className="text-gray-900 not-italic">{item.quantity}</span></p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-black text-gray-900 italic leading-none">₹{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-[10px] font-black text-purple-600 tracking-tighter uppercase mt-2 italic">Valuation confirmed</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 💎 DISCOUNT SUMMARY */}
                      {order.discountAmount > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                          <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-2xl border border-emerald-100 tracking-[0.2em] shadow-sm">
                              Promo Applied: {order.promoCode || 'REWARD'}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Privilege Savings</p>
                            <p className="text-xl font-black text-emerald-600 tracking-tighter italic">- ₹{order.discountAmount?.toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-6 flex justify-between items-center sm:flex-row flex-col gap-6">
                        <div className="flex items-center gap-4 text-emerald-600">
                          <CheckCircle size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">Authenticity Guaranteed</span>
                        </div>

                        {(order.paymentStatus === 'PAID' || order.status === 'DELIVERED') && (
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                const response = await axios.get(
                                  `/api/invoices/order/${order.orderId}/download`,
                                  {
                                    headers: { Authorization: `Bearer ${token}` },
                                    responseType: "blob",
                                  }
                                );
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", `Boutique-Invoice-${order.orderId}.pdf`);
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                              } catch (error) {
                                console.error("Failed to download invoice:", error);
                                alert("Vault documentation is still being prepared.");
                              }
                            }}
                            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 italic group/dl"
                          >
                            <FileText size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            Download Archive Receipt
                            <Download size={14} className="opacity-40" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Support Section */}
        <div className="pt-12 text-center border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 italic">Concierge Service Available 24/7</p>
          <div className="flex justify-center gap-8">
            <Link to="/contact" className="text-xs font-black text-gray-900 hover:text-purple-600 transition-colors uppercase tracking-widest border-b border-gray-200 pb-1 italic">Contact Advisor</Link>
            <Link to="/brands" className="text-xs font-black text-gray-900 hover:text-purple-600 transition-colors uppercase tracking-widest border-b border-gray-200 pb-1 italic">Our Maisons</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
