import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const updateQty = (id, value) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty + value) } : item
      )
      .filter((i) => i.qty > 0);

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercentage / 100) : 0;
  const shipping = subtotal > 5000 ? 0 : 200;
  const taxableAmount = subtotal - discountAmount;
  const tax = Math.round(taxableAmount * 0.18); // 18% GST (Calculated after discount)
  const total = taxableAmount + shipping + tax;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      setPromoError("");
      setPromoSuccess("");
      const res = await axios.get(`/api/coupons/validate?code=${promoCode.trim().toUpperCase()}`);

      setAppliedPromo(res.data);
      setPromoSuccess(`Success! Code ${res.data.code} applied. (${res.data.discountPercentage}% OFF)`);
      setPromoCode("");
    } catch (err) {
      setPromoError(err.response?.data || "Invalid promo code.");
      setAppliedPromo(null);
    }
  };

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Purple Header */}
        <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-32 pb-16 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Shopping Cart
            </h1>
            <p className="text-xl text-purple-100">
              Your luxury timepiece collection awaits
            </p>
          </div>
        </section>

        {/* Empty State */}
        <div className="py-20 px-6">
          <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-lg border border-gray-100 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any watches to your collection yet. Explore our premium timepieces!
            </p>

            <button
              onClick={() => navigate("/watches")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Browse Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= PURPLE HEADER ================= */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-32 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Shopping Cart
              </h1>
              <p className="text-purple-100">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/watches")}
              className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      </section>

      {/* ================= CART CONTENT ================= */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="flex flex-col sm:flex-row gap-6">

                  {/* Product Image */}
                  <div className="sm:w-32 sm:h-32 w-full aspect-square bg-gray-50 rounded-xl p-4 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || item.imageUrl || "/default-image.jpg"}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">Premium Watch</p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-purple-600">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">per item</span>
                      </div>
                    </div>

                    {/* Quantity & Subtotal */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                        <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition font-bold text-gray-700 rounded-l-lg"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-bold text-gray-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition font-bold text-gray-700 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Section */}
            <div className={`mt-8 p-8 rounded-[32px] border transition-all duration-500 shadow-sm ${appliedPromo ? 'bg-emerald-50/50 border-emerald-100' : 'bg-[#f8faff] border-indigo-100/50'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${appliedPromo ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Have a Promo Code?</h3>
                  <p className="text-sm text-gray-500 font-medium tracking-wide">Enter your code to unlock exclusive offers</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
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
                  className={`px-10 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg ${appliedPromo ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-[#a855f7] hover:bg-[#9333ea] shadow-indigo-200'}`}
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-tight">{promoError}</p>
                </div>
              )}

              {promoSuccess && (
                <div className="mt-4 flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-emerald-800 tracking-tight">{promoSuccess}</p>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoSuccess("");
                    }}
                    className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-32 overflow-hidden">

              {/* Summary Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>

              {/* Summary Details */}
              <div className="p-6 space-y-4">

                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Discount */}
                {appliedPromo && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium italic">Discount ({appliedPromo.discountPercentage}%)</span>
                    <span className="text-lg font-bold">
                      - ₹{discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ₹{shipping.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Tax (GST 18%)</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-purple-600">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                {/* Free Shipping Message */}
                {subtotal < 5000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800 font-medium">
                      💡 Add ₹{(5000 - subtotal).toLocaleString()} more to get FREE shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-6"
                >
                  Proceed to Checkout
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs pt-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Checkout
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center mb-3">We Accept</p>
                  <div className="flex items-center justify-center gap-4 grayscale opacity-60">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-7" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="PayPal" />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">100% Authentic</h4>
                    <p className="text-xs text-gray-500">Certified genuine products</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Secure Payment</h4>
                    <p className="text-xs text-gray-500">256-bit SSL encryption</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Easy Returns</h4>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
