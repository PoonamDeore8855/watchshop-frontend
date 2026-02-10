import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "./WishlistButton";

// SALE IMAGES
import sale1 from "../assets/watch1.jpg";
import sale2 from "../assets/watch2.jpg";
import sale3 from "../assets/watch3.jpg";
import sale4 from "../assets/watch17.jpg";
import sale5 from "../assets/watch18.jpg";
import sale6 from "../assets/watch19.jpg";
import sale7 from "../assets/watch10.jpg";
import sale8 from "../assets/watch20.jpg";
import sale9 from "../assets/watch21.jpg";
import sale10 from "../assets/watch12.jpg";

export default function Sale() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saleItems = [
    {
      id: 1,
      name: "Classic Leather Watch",
      price: 12000,
      discount: 8999,
      image: sale1,
      savings: "25% OFF",
      badge: "Limited"
    },
    {
      id: 2,
      name: "Luxury Gold Watch",
      price: 25000,
      discount: 18500,
      image: sale2,
      savings: "26% OFF",
      badge: "Hot Deal"
    },
    {
      id: 3,
      name: "Sport Chronograph Pro",
      price: 18000,
      discount: 13499,
      image: sale3,
      savings: "25% OFF",
      badge: "Trending"
    },
    {
      id: 4,
      name: "Titan Neo Analog",
      price: 16000,
      discount: 11999,
      image: sale4,
      savings: "25% OFF",
      badge: "Popular"
    },
    {
      id: 5,
      name: "Fastrack Reflex",
      price: 14000,
      discount: 9999,
      image: sale5,
      savings: "29% OFF",
      badge: "Best Seller"
    },
    {
      id: 6,
      name: "Noise ColorFit Ultra",
      price: 20000,
      discount: 14999,
      image: sale6,
      savings: "25% OFF",
      badge: "Featured"
    },
    {
      id: 7,
      name: "Boat Xtend Smartwatch",
      price: 15000,
      discount: 10999,
      image: sale7,
      savings: "27% OFF",
      badge: "Deal"
    },
    {
      id: 8,
      name: "Fire-Boltt Phoenix",
      price: 13000,
      discount: 9499,
      image: sale8,
      savings: "27% OFF",
      badge: "Flash Sale"
    },
    {
      id: 9,
      name: "HMT Classic Handwind",
      price: 17000,
      discount: 12499,
      image: sale9,
      savings: "26% OFF",
      badge: "Limited"
    },
    {
      id: 10,
      name: "Sonata Edge Series",
      price: 11000,
      discount: 7999,
      image: sale10,
      savings: "27% OFF",
      badge: "Special"
    }
  ];

  const handleBuyNow = (item) => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login", {
        state: {
          from: "sale-buy-now",
          product: {
            id: item.id,
            name: item.name,
            price: item.discount,
            image: item.image,
            qty: 1
          }
        }
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.discount,
        image: item.image,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO BANNER ================= */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-28 pb-12 px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Fire Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-lg rounded-full text-white text-xs font-bold mb-4 border border-white/30">
            <span className="text-lg">🔥</span>
            LIMITED TIME OFFER
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 leading-tight">
            MEGA SALE
          </h1>

          <p className="text-xl md:text-2xl font-bold text-amber-400 mb-2">
            Up to 35% OFF
          </p>

          <p className="text-base text-white/90 mb-6 max-w-2xl mx-auto">
            Hurry! Limited stock available. Don't miss these incredible deals on premium watches!
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-xl p-3 min-w-[80px]">
              <div className="text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs text-white/80 font-semibold">HOURS</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-xl p-3 min-w-[80px]">
              <div className="text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs text-white/80 font-semibold">MINUTES</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-xl p-3 min-w-[80px]">
              <div className="text-3xl font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs text-white/80 font-semibold">SECONDS</div>
            </div>
          </div>

          <p className="text-white text-sm font-medium">
            ⏰ Sale ends soon! Shop now before it's too late
          </p>
        </div>
      </section>

      {/* ================= SALE ITEMS GRID ================= */}
      <section className="px-8 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              🎯 Hot Deals on Premium Watches
            </h2>
            <p className="text-gray-600 text-lg">
              Save big on luxury timepieces. Limited quantities available!
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saleItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full shadow-lg">
                    {item.badge}
                  </div>

                  {/* Heart Wishlist Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton
                      product={{
                        id: item.id,
                        name: item.name,
                        price: item.discount,
                        image: item.image
                      }}
                      className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
                    />
                  </div>

                  {/* Quick View on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-sm flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 h-10">
                    {item.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-red-600">
                      ₹{item.discount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-green-600 font-bold mb-3">
                    💰 Save ₹{(item.price - item.discount).toLocaleString()}
                  </div>

                  <button
                    onClick={() => handleBuyNow(item)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROMO BANNER ================= */}
      <section className="px-8 py-12 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl font-black mb-3">
            🎁 Extra 5% Off on First Order
          </h3>
          <p className="text-lg mb-6 text-purple-100">
            Sign up now and get an exclusive discount code for your first purchase!
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl hover:bg-yellow-300 hover:text-purple-900 transition-all shadow-2xl active:scale-95"
          >
            Sign Up & Get Discount
          </button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-8 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">100% Authentic</h4>
              <p className="text-xs text-gray-500">Genuine Products</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Easy Returns</h4>
              <p className="text-xs text-gray-500">30-Day Policy</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Best Prices</h4>
              <p className="text-xs text-gray-500">Guaranteed</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Fast Delivery</h4>
              <p className="text-xs text-gray-500">3-5 Business Days</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
