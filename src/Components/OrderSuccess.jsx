import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { CheckCircle2, Package, Truck, Calendar, User, ArrowRight, Download, Home, ShoppingBag, AlertCircle } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [hasInvoice, setHasInvoice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🎉 Celebration!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Check if invoice exists
    if (state?.orderId) {
      const token = localStorage.getItem("token");
      axios
        .get(`/api/invoices/order/${state.orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setHasInvoice(true))
        .catch(() => setHasInvoice(false))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => clearInterval(interval);
  }, [state]);

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/invoices/order/${state.orderId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${state.orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  };

  if (!state) {
    return (
      <div className="pt-40 min-h-screen bg-gray-50 flex flex-col items-center px-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-red-100">
          <div className="text-red-500 text-6xl mb-4 italic font-black">!</div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-8 font-medium">We couldn't retrieve your order details. This might happen if you refresh the page.</p>
          <button onClick={() => navigate("/")} className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition active:scale-95 flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", date: state.orderDate, completed: true, icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: "Processing", date: "Today", completed: true, icon: <Package className="w-5 h-5" /> },
    { label: "Shipped", date: "Awaiting", completed: false, icon: <Truck className="w-5 h-5" /> },
    { label: "Delivered", date: "Estimated 3-5 days", completed: false, icon: <Home className="w-5 h-5" /> },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#fcfcfc] flex flex-col items-center px-4 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full">

        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-3">
            Payment Received
          </h1>
          <p className="text-gray-500 font-medium text-lg italic uppercase tracking-tighter">
            Your Order Has Been Successfully Placed
          </p>

          {/* 📧 EMAIL ERROR WARNING - TEXT ONLY */}
          {state.emailError && (
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-[2rem] max-w-2xl mx-auto text-left animate-in bounce-in duration-700">
              <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Delivery Note: Email Dispatch Interrupted</p>
              <p className="text-xs font-bold text-amber-700 mt-1">
                We attempted to send your confirmation to <span className="underline italic text-amber-900">{state.email}</span>, but the recipient's inbox is out of storage space (Error 552).
                Please free up storage and visit your Dashboard to view order details.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Order Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Timeline - TEXT ONLY */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Order Status Timeline</h2>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${step.completed ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                    <div className="flex-1 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className={step.completed ? 'text-gray-900' : 'text-gray-400'}>{step.label}</span>
                      <span className="text-gray-400">{idx === 0 ? new Date(step.date).toLocaleDateString() : step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Items Details</h2>
                <span className="text-xs font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">
                  {state.items?.length || 0} Total Items
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {state.items?.map((item, idx) => (
                  <div key={idx} className="py-6 flex justify-between items-center group">
                    <div className="space-y-1">
                      <h3 className="font-black text-gray-900 uppercase tracking-tight">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Qty: {item.quantity}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-xl tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Meta */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Order Date</p>
                <p className="font-black text-gray-900">{new Date(state.orderDate).toLocaleString()}</p>
              </div>
              {/* User Meta */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Customer Account</p>
                <p className="font-black text-gray-900 truncate">{state.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Summary & Actions */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 sticky top-32">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-tight">
                  <span className="text-gray-400">Order Ref</span>
                  <span className="text-gray-900">#{state.orderId}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-tight">
                  <span className="text-gray-400">Status</span>
                  <span className="text-purple-600 italic underline tracking-widest">{state.status}</span>
                </div>
                <div className="border-t border-gray-100 pt-6 flex flex-col gap-1 items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter italic">₹{state.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                {!loading && hasInvoice && (
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition"
                  >
                    Download Invoice
                  </button>
                )}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition active:scale-95 shadow-lg"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full border-2 border-gray-100 py-5 rounded-3xl font-black uppercase tracking-widest text-xs text-gray-400 hover:border-gray-200 hover:text-gray-600 transition active:scale-95"
                >
                  Shop More
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                Timeless Pieces • secured checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
