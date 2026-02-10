import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import PreviewModal from "./PreviewModal";

export default function Products() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/products/get")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "add-to-cart", product: item } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const price = Number(String(item.price).replace(/[₹,]/g, ""));
    const productId = Number(item.id);
    const existing = cart.find(p => Number(p.id) === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: item.name,
        price: price,
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
    const price = Number(String(item.price).replace(/[₹,]/g, ""));
    const product = {
      id: Number(item.id),
      name: item.name,
      price: price,
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

  if (loading) return <div className="pt-40 text-center font-bold text-xl">Loading Collections...</div>;

  return (
    <section className="bg-white min-h-screen pt-10">

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            Our Collection
          </h1>
          <p className="text-gray-500 font-medium italic">Explore our world-class precision timepieces.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                <img
                  src={product.imageUrl || "/default-image.jpg"}
                  alt={product.name}
                  onClick={() => openPreview(product)}
                  className="w-full h-full object-contain p-8 group-hover:scale-110 transition duration-700 cursor-zoom-in"
                />

                {/* Hover Actions */}
                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-black text-white py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-purple-700 transition active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-purple-600 uppercase mb-1">{product.brand || "Luxury"}</p>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h4>
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && activeProduct && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setShowPreview(false)}
          onAdd={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      <Footer />
    </section>
  );
}
