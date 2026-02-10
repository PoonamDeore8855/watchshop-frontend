import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PreviewModal from "./PreviewModal";
import WishlistButton from "./WishlistButton";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/products/get")
      .then(res => setProducts(res.data.slice(0, 8)))
      .catch(err => console.error("Error fetching home products:", err));
  }, []);

  const handleAddToCart = (item) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "add-to-cart", product: item } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const priceNum = Number(String(item.price).replace(/[₹,]/g, ""));
    const productId = Number(item.id);
    const existing = cart.find(p => Number(p.id) === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: item.name,
        price: priceNum,
        image: item.imageUrl || item.image,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  const handleBuyNow = (item) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "buynow", product: item } });
      return;
    }
    const priceNum = Number(String(item.price).replace(/[₹,]/g, ""));
    const product = {
      id: Number(item.id),
      name: item.name,
      price: priceNum,
      image: item.imageUrl || item.image,
      qty: 1
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    navigate("/checkout");
  };

  const openPreview = (product) => {
    setActiveProduct(product);
    setShowPreview(true);
  };

  return (
    <div className="w-full overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-32 pb-24 px-8 md:px-16 overflow-hidden">
        {/* Animated Background Blurs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Decorative Circles - Right Side */}
        <div className="absolute top-20 right-[15%] w-[450px] h-[450px] border-2 border-white/10 rounded-full"></div>
        <div className="absolute top-10 right-[10%] w-[550px] h-[550px] border border-white/5 rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="text-white space-y-6">

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1]">
                Elevate Your
                <span className="block text-amber-400 mt-2">
                  Time in Style
                </span>
              </h1>

              <p className="text-xl text-purple-100 leading-relaxed max-w-xl">
                Discover premium watches crafted with Swiss precision. Every second counts when you wear excellence.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate("/watches")}
                  className="group px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold text-lg hover:bg-amber-400 hover:text-purple-900 transition-all duration-300 shadow-2xl hover:shadow-amber-400/50 active:scale-95 flex items-center gap-2"
                >
                  Shop Collection
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button
                  onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Explore Trends
                </button>
              </div>
            </div>

            {/* Right Visual - Clock Circle */}
            <div className="relative flex items-center justify-center">
              {/* Price Tag - Top Right */}
              <div className="absolute -top-4 -right-8 bg-white text-purple-900 px-5 py-2.5 rounded-xl shadow-2xl font-black text-sm z-20 rotate-3 hover:rotate-0 transition-transform cursor-default">
                From ₹5,999
              </div>

              {/* Discount Badge - Bottom Left */}
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-xl shadow-2xl font-black text-base z-20 -rotate-3 hover:rotate-0 transition-transform cursor-default flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                35% OFF
              </div>

              {/* Main Clock Circle */}
              <div className="relative w-[400px] h-[400px]">
                {/* Outer Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-2xl animate-pulse"></div>

                {/* Middle Circle */}
                <div className="absolute inset-12 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full backdrop-blur-xl border-2 border-white/20 flex items-center justify-center shadow-2xl">

                  {/* Inner Circle - Clock Face */}
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full flex items-center justify-center relative shadow-2xl">
                    {/* Top Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-full"></div>

                    {/* Clock Icon */}
                    <svg className="w-24 h-24 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES BANNER ================= */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹5000" },
              { icon: "🔒", title: "Secure Payment", desc: "100% protected checkout" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
              { icon: "💎", title: "Authentic", desc: "100% genuine products" }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 hover:bg-white rounded-2xl transition-all">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <div className="font-bold text-gray-900">{feature.title}</div>
                <div className="text-sm text-gray-500">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      <section id="trending" className="px-8 md:px-16 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-purple-600 font-bold text-sm tracking-widest uppercase">CURATED COLLECTION</span>
              <h2 className="text-5xl font-black text-gray-900 mt-2">
                Trending Now ⌚
              </h2>
              <p className="text-gray-500 mt-2">Discover the season's most coveted timepieces</p>
            </div>
            <button
              onClick={() => navigate("/watches")}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 hover:scale-105 transition-all shadow-lg"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-white overflow-hidden">
                  <img
                    src={item.imageUrl || item.image || "/default-image.jpg"}
                    alt={item.name}
                    onClick={() => openPreview(item)}
                    className="h-full w-full object-contain p-8 group-hover:scale-110 transition duration-700 cursor-zoom-in"
                  />

                  {/* Wishlist Icon */}
                  <div className="absolute top-4 right-4 z-10">
                    <WishlistButton
                      product={{
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.imageUrl || item.image
                      }}
                      className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                    />
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-4 left-4 right-4 bg-purple-600 text-white py-3 px-6 rounded-2xl font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-purple-700 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-2">
                      {item.name}
                    </h4>
                    <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-lg whitespace-nowrap">
                      NEW
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{Math.round(item.price * 1.35).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★★★★★</span>
                      <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                    </div>
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="text-sm font-bold text-purple-600 hover:text-purple-700 transition flex items-center gap-1"
                    >
                      Buy Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="md:hidden mt-8 text-center">
            <button
              onClick={() => navigate("/watches")}
              className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg w-full"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="px-8 md:px-16 py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-bold text-sm tracking-widest uppercase">SHOP BY STYLE</span>
            <h2 className="text-5xl font-black text-gray-900 mt-2 mb-4">
              Find Your Perfect Match
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From classic elegance to modern sophistication, explore our curated categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Luxury Collection",
                desc: "Premium Swiss timepieces",
                gradient: "from-amber-500 to-orange-600",
                icon: "👑"
              },
              {
                title: "Sport Series",
                desc: "Built for performance",
                gradient: "from-blue-500 to-cyan-600",
                icon: "⚡"
              },
              {
                title: "Classic Elegance",
                desc: "Timeless sophistication",
                gradient: "from-purple-500 to-pink-600",
                icon: "✨"
              }
            ].map((cat, idx) => (
              <div
                key={idx}
                className={`relative group cursor-pointer rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
                onClick={() => navigate("/watches")}
              >
                <div className={`bg-gradient-to-br ${cat.gradient} p-12 h-64 flex flex-col justify-end relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]"></div>
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {cat.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                      Explore
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="px-8 md:px-16 py-20 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm font-semibold tracking-wider border border-white/20">
              LIMITED TIME OFFER
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Up to <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">35% OFF</span>
            <br />
            on Premium Watches
          </h2>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Transform your style with Swiss precision craftsmanship. Exclusive deals await!
          </p>

          <button
            onClick={() => navigate("/watches")}
            className="px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-600 text-black rounded-2xl font-black text-lg hover:scale-105 transition-all duration-300 shadow-2xl active:scale-95"
          >
            Claim Your Offer →
          </button>

          <div className="mt-12 flex justify-center gap-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-Day Returns
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Authentic
            </div>
          </div>
        </div>
      </section>

      {/* PREVIEW MODAL */}
      {showPreview && activeProduct && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setShowPreview(false)}
          onAdd={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
}
