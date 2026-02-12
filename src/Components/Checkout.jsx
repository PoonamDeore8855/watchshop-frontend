import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  MapPin,
  Hash,
  CreditCard,
  CheckCircle,
  Truck,
  ArrowLeft,
  ShoppingBag,
  Phone
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // ONLINE or COD
  const [loadingStage, setLoadingStage] = useState(""); // Granular loading feedback
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));
    if (buyNowProduct) {
      setCart([buyNowProduct]);
    } else {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(data);
    }
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

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
      setLoadingStage("Securing your items...");
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.qty || 1,
      }));

      const orderRes = await axios.post(
        "/api/checkout/place",
        {
          items,
          discountAmount: 0,
          promoCode: null,
          paymentMethod: paymentMethod // Pass paymentMethod to backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoadingStage("Initializing payment...");

      const responseData = orderRes.data;
      const backendOrderId = responseData.orderId || responseData.id;

      if (paymentMethod === "COD") {
        localStorage.removeItem("cart");
        localStorage.removeItem("buyNowProduct");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/ordersuccess", { state: orderRes.data });
        setLoading(false);
        return;
      }

      if (typeof window.Razorpay === "undefined") {
        alert("Payment gateway is loading. Please wait a moment and try again.");
        setLoading(false);
        return;
      }

      // ✅ UNIFIED: Use Razorpay order created during checkout placement
      const rzpOrderId = responseData.razorpayOrderId;
      const rzpAmount = responseData.razorpayAmount;
      const rzpCurrency = responseData.razorpayCurrency;

      if (!rzpOrderId) {
        throw new Error("Failed to initialize payment gateway order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpAmount,
        currency: rzpCurrency,
        name: "WatchShop",
        description: `Order #${backendOrderId}`,
        order_id: rzpOrderId,
        handler: async function (response) {
          setLoading(true);
          try {
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
            localStorage.removeItem("cart");
            localStorage.removeItem("buyNowProduct");
            window.dispatchEvent(new Event("cartUpdated"));
            navigate("/ordersuccess", { state: orderRes.data });
          } catch (vErr) {
            console.error("Verification Failed:", vErr);
            alert("Payment successful but verification failed.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        },
        theme: { color: "#7c3aed" }
      };

      const rzp1 = new window.Razorpay(options);
      setLoadingStage("Waiting for payment...");
      rzp1.open();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
      setLoading(false);
      setLoadingStage("");
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md bg-white p-12 rounded-3xl shadow-lg">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-purple-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is empty</h2>
        <p className="text-gray-500 mb-8">Add components to your cart to proceed with checkout.</p>
        <button onClick={() => navigate("/watches")} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all">Go back to Boutique</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER SECTION (Matches Cart Theme) */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-32 pb-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-purple-100 flex items-center gap-2">
              Complete your order for {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Cart
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: SHIPPING & PAYMENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* SHIPPING INFO */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white rounded-xl outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 99887 76655"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white rounded-xl outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="address"
                      placeholder="Street, Landmark, District"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white rounded-xl outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Pune"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white rounded-xl outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Zip Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="6-digit PIN"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white rounded-xl outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Gateway</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === "ONLINE" ? "border-purple-600 bg-purple-50" : "border-gray-50 bg-gray-50 hover:border-gray-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === "ONLINE" ? "bg-purple-600 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                      <CreditCard size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${paymentMethod === "ONLINE" ? "text-purple-900" : "text-gray-900"}`}>Pay Online</p>
                      <p className="text-xs text-gray-500">Secure Razorpay</p>
                    </div>
                  </div>
                  {paymentMethod === "ONLINE" && <CheckCircle className="text-purple-600" size={20} />}
                </button>

                <button
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === "COD" ? "border-emerald-500 bg-emerald-50" : "border-gray-50 bg-gray-50 hover:border-gray-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === "COD" ? "bg-emerald-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                      <Truck size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${paymentMethod === "COD" ? "text-emerald-900" : "text-gray-900"}`}>Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Handled at doorstep</p>
                    </div>
                  </div>
                  {paymentMethod === "COD" && <CheckCircle className="text-emerald-500" size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-32 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Items preview */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                        <img src={item.image || item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        <p className="text-sm font-bold text-purple-600 mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Shipping</span>
                    {shipping === 0 ? <span className="text-green-600 font-bold tracking-tight">FREE</span> : <span className="font-bold">₹{shipping.toLocaleString()}</span>}
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Tax (GST 18%)</span>
                    <span className="font-bold">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-2xl font-black text-purple-600 tracking-tight">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-100"}`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm">{loadingStage || "Processing..."}</span>
                    </>
                  ) : (
                    paymentMethod === "COD" ? "Confirm Order" : "Pay & Place Order"
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle size={12} /> Secure Checkout Guaranteed
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
