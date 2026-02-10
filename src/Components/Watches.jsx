import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PreviewModal from "./PreviewModal";
import Footer from "./Footer";
import WishlistButton from "./WishlistButton";

export default function Watches() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products/get")
      .then(res => {
        setWatches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching watches:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "add-to-cart", product } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const price = Number(String(product.price).replace(/[₹,]/g, ""));
    const productId = Number(product.id);
    const existing = cart.find(item => Number(item.id) === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: price,
        image: product.imageUrl || product.image,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  const handleBuyNow = (product) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "buynow", product } });
      return;
    }
    const price = Number(String(product.price).replace(/[₹,]/g, ""));
    const item = {
      id: Number(product.id),
      name: product.name,
      price: price,
      image: product.imageUrl || product.image,
      qty: 1
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(item));
    navigate("/checkout");
  };

  const openPreview = (watch) => {
    setActiveProduct(watch);
    setShowPreview(true);
  };

  if (loading) return <div className="pt-40 text-center font-bold text-xl">Discovering Timepieces...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Full Collection
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl">
            Browse our complete selection of luxury, classic, and modern watches.
            Each piece is verified for authenticity and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {watches.map(watch => (
            <div
              key={watch.id}
              className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                <img
                  src={watch.imageUrl || "/default-image.jpg"}
                  alt={watch.name}
                  onClick={() => openPreview(watch)}
                  className="w-full h-full object-contain p-8 group-hover:scale-110 transition duration-700 cursor-zoom-in"
                />

                {/* Wishlist Heart Button */}
                <div className="absolute top-4 right-4 z-10">
                  <WishlistButton
                    product={{
                      id: watch.id,
                      name: watch.name,
                      price: watch.price,
                      image: watch.imageUrl
                    }}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
                  />
                </div>

                <button
                  onClick={() => handleAddToCart(watch)}
                  className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-2xl font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 active:scale-95"
                >
                  + Add to Cart
                </button>
              </div>

              <div className="p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1">{watch.brand || "Selection"}</p>
                <h4 className="font-bold text-gray-900 mb-2 truncate">{watch.name}</h4>
                <p className="text-xl font-black text-gray-900">₹{watch.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setShowPreview(false)}
          onAdd={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
      <Footer />
    </div>
  );
}
