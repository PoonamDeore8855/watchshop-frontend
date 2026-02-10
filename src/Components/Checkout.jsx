import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // ONLINE or COD
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  useEffect(() => {
    // Check if buyNowProduct exists first, else use cart
    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));
    if (buyNowProduct) {
      setCart([buyNowProduct]);
    } else {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(data);
    }
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercentage / 100) : 0;
  const total = subtotal - discountAmount;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    try {
      setPromoError("");
      setPromoSuccess("");
      const res = await axios.get(`/api/coupons/validate?code=${promoCode.trim().toUpperCase()}`);
      setAppliedPromo(res.data);
      setPromoSuccess(`Code ${res.data.code} applied!`);
      setPromoCode("");
    } catch (err) {
      setPromoError(err.response?.data || "Invalid promo code.");
      setAppliedPromo(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    try {
      // 1️⃣ CREATE DB ORDER (PENDING)
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.qty || 1,
      }));

      const orderRes = await axios.post(
        "/api/checkout/place",
        {
          items,
          discountAmount,
          promoCode: appliedPromo?.code
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const backendOrderId = orderRes.data.orderId || orderRes.data.id;
      console.log("DB Order Created:", backendOrderId);

      // 2️⃣ CHECK PAYMENT METHOD
      if (paymentMethod === "COD") {
        // Cash on Delivery - Skip payment gateway
        localStorage.removeItem("cart");
        localStorage.removeItem("buyNowProduct");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/ordersuccess", { state: orderRes.data });
        setLoading(false);
        return;
      }

      // 3️⃣ ONLINE PAYMENT - Check if Razorpay is loaded
      if (typeof window.Razorpay === "undefined") {
        alert("Payment gateway is loading. Please wait a moment and try again.");
        setLoading(false);
        return;
      }

      // 4️⃣ CREATE RAZORPAY ORDER
      const paymentRes = await axios.post(
        "/api/payment/create-order",
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rzpOrder = paymentRes.data;
      console.log("Razorpay Order Created:", rzpOrder);

      // 5️⃣ OPEN RAZORPAY CHECKOUT WITH CUSTOMIZATION
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "WatchShop",
        description: `Order #${backendOrderId}`,
        order_id: rzpOrder.orderId,
        handler: async function (response) {
          console.log("Payment Success:", response);
          setLoading(true);

          try {
            // 4️⃣ VERIFY PAYMENT
            await axios.post(
              "/api/payment/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                backendOrderId: backendOrderId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ SUCCESS - Clear cart and redirect
            localStorage.removeItem("cart");
            localStorage.removeItem("buyNowProduct");
            window.dispatchEvent(new Event("cartUpdated"));
            navigate("/ordersuccess", { state: orderRes.data });
          } catch (vErr) {
            console.error("Verification Failed:", vErr);
            alert("Payment successful but verification failed. Please contact support with Order ID: " + backendOrderId);
            setLoading(false);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@watchshop.com",
          contact: "9876543210"
        },
        notes: {
          order_id: backendOrderId,
          items: cart.map(item => item.name).join(", ")
        },
        theme: {
          color: "#7c3aed",
          backdrop_color: "rgba(0, 0, 0, 0.5)"
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [{ method: "upi" }]
              },
              card: {
                name: "Credit/Debit Cards",
                instruments: [{ method: "card" }]
              },
              netbanking: {
                name: "Netbanking",
                instruments: [{ method: "netbanking" }]
              },
              wallet: {
                name: "Wallets",
                instruments: [{ method: "wallet" }]
              }
            },
            sequence: ["block.upi", "block.card", "block.netbanking", "block.wallet"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled. Your order is still pending.");
            setLoading(false);
          },
          escape: false,
          animation: true,
          confirm_close: true
        },
        redirect: false
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on('payment.failed', function (response) {
        console.error("Payment Failed:", response.error);
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp1.open();

    } catch (err) {
      console.error("Checkout Error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to initiate payment.";
      setError(msg);

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      // Loading state managed by modal callbacks for online payment
      // For COD, loading is stopped immediately after redirect
    }
  };

  if (cart.length === 0) return <div className="pt-40 text-center">Empty Checkout</div>;

  return (
    <div className="pt-32 pb-40 min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT: SHIPPING DETAILS (STATIC FOR NOW) */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8">Shipping</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full border rounded-2xl px-5 py-4 bg-gray-50 focus:ring-2 focus:ring-black outline-none transition" defaultValue="John Doe" />
            <input type="text" placeholder="Address" className="w-full border rounded-2xl px-5 py-4 bg-gray-50 focus:ring-2 focus:ring-black outline-none transition" defaultValue="123 Watch Street, Time City" />
            <div className="flex gap-4">
              <input type="text" placeholder="City" className="flex-1 border rounded-2xl px-5 py-4 bg-gray-50 focus:ring-2 focus:ring-black outline-none transition" defaultValue="Mumbai" />
              <input type="text" placeholder="PIN" className="w-1/3 border rounded-2xl px-5 py-4 bg-gray-50 focus:ring-2 focus:ring-black outline-none transition" defaultValue="400001" />
            </div>
          </div>

          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-400 mt-8">Payment Method</h3>

          {/* ONLINE PAYMENT OPTION */}
          <div
            onClick={() => setPaymentMethod("ONLINE")}
            className={`border-2 p-6 rounded-3xl flex items-center justify-between cursor-pointer transition mb-4 ${paymentMethod === "ONLINE"
              ? "border-purple-600 bg-purple-50"
              : "border-gray-200 bg-white hover:border-purple-300"
              }`}
          >
            <div>
              <span className={`font-black ${paymentMethod === "ONLINE" ? "text-purple-900" : "text-gray-700"}`}>
                Online Payment
              </span>
              <p className={`text-xs mt-1 ${paymentMethod === "ONLINE" ? "text-purple-600" : "text-gray-500"}`}>
                UPI • Cards • Net Banking • Wallets
              </p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === "ONLINE" ? "bg-purple-600" : "bg-gray-300"
              }`}>
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          {/* CASH ON DELIVERY OPTION */}
          <div
            onClick={() => setPaymentMethod("COD")}
            className={`border-2 p-6 rounded-3xl flex items-center justify-between cursor-pointer transition ${paymentMethod === "COD"
              ? "border-green-600 bg-green-50"
              : "border-gray-200 bg-white hover:border-green-300"
              }`}
          >
            <div>
              <span className={`font-black ${paymentMethod === "COD" ? "text-green-900" : "text-gray-700"}`}>
                Cash on Delivery
              </span>
              <p className={`text-xs mt-1 ${paymentMethod === "COD" ? "text-green-600" : "text-gray-500"}`}>
                Pay when you receive the order
              </p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === "COD" ? "bg-green-600" : "bg-gray-300"
              }`}>
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* Luxury Promo Code Section */}
        <div className={`mt-8 p-8 rounded-[40px] border transition-all duration-500 shadow-sm ${appliedPromo ? 'bg-emerald-50/50 border-emerald-100' : 'bg-[#f8faff] border-indigo-100/50'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${appliedPromo ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Have a Promo Code?</h3>
              <p className="text-sm text-gray-500 font-medium tracking-wide">Unlock exclusive discounts</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className={`w-full pl-6 pr-4 py-4 rounded-2xl border bg-white focus:ring-4 outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300 placeholder:font-medium ${appliedPromo ? 'border-emerald-200 focus:ring-emerald-50' : 'border-indigo-100 focus:ring-indigo-50 group-hover:border-indigo-200'}`}
              />
            </div>
            <button
              onClick={applyPromoCode}
              className={`px-8 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg ${appliedPromo ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-[#a855f7] hover:bg-[#9333ea]'}`}
            >
              Apply
            </button>
          </div>

          {promoError && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-xs font-bold uppercase tracking-tight">{promoError}</p>
            </div>
          )}

          {promoSuccess && (
            <div className="mt-4 flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-sm font-bold text-emerald-800 tracking-tight">{promoSuccess}</p>
              <button
                onClick={() => {
                  setAppliedPromo(null);
                  setPromoSuccess("");
                }}
                className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:underline px-3 py-1.5 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: SUMMARY */}
      <div className="flex flex-col justify-between">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-8">Summary</h2>

          <div className="space-y-4 mb-10">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-600">{item.name} x {item.qty}</span>
                <span className="font-black">₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3">
            <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between text-emerald-600 font-bold uppercase text-[10px] tracking-widest">
                <span>Discount ({appliedPromo.discountPercentage}%)</span>
                <span>- ₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 pt-4">
              <span>Total</span>
              <span className="text-purple-700">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {error && <p className="mt-6 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full mt-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-3
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}
                `}
          >
            {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order (COD)" : "Pay Now"}
            {!loading && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {paymentMethod === "COD" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                )}
              </svg>
            )}
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-8">
          Secured experience by TIMELESS PIECES
        </p>
      </div>

    </div>
  );
}
