import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "./WishlistButton";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // ✅ SAFE LOAD WISHLIST
  useEffect(() => {
    loadWishlist();

    // Listen for wishlist updates
    const handleUpdate = () => loadWishlist();
    window.addEventListener("wishlistUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loadWishlist = () => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      const data = storedWishlist ? JSON.parse(storedWishlist) : [];
      setWishlist(data);
    } catch (err) {
      console.error("Invalid wishlist JSON", err);
      setWishlist([]);
    }
  };

  // ❌ REMOVE FROM WISHLIST
  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // 🛒 MOVE TO CART (SAFE)
  const moveToCart = (item) => {
    // 1️⃣ Login check
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", {
        state: { from: "wishlist", product: item },
      });
      return;
    }

    // ✅ SAFE CART LOAD
    let cart = [];
    try {
      const storedCart = localStorage.getItem("cart");
      cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      cart = [];
    }

    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: 1,
        delivery: "Monday, 09 Feb",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    // 3️⃣ Remove from wishlist
    const updatedWishlist = wishlist.filter((w) => w.id !== item.id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));

    // 4️⃣ Go to cart
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= PURPLE HEADER ================= */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-12 h-12 text-red-300 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            My Wishlist
          </h1>
          <p className="text-xl text-purple-100">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </section>

      {/* ================= WISHLIST CONTENT ================= */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {wishlist.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-purple-600 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding watches you love to your wishlist. Click the heart icon on any product!
              </p>
              <button
                onClick={() => navigate("/watches")}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg active:scale-95"
              >
                Explore Watches
              </button>
            </div>
          ) : (
            // Wishlist Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
                    onClick={() => navigate("/watchdetails", { state: { product: item } })}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Heart Button - Positioned */}
                    <div className="absolute top-3 right-3">
                      <WishlistButton
                        product={item}
                        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3
                      className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition cursor-pointer"
                      onClick={() => navigate("/watchdetails", { state: { product: item } })}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{item.price?.toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => moveToCart(item)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Move to Cart
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTINUE SHOPPING ================= */}
      {wishlist.length > 0 && (
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto text-center">
            <button
              onClick={() => navigate("/watches")}
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
