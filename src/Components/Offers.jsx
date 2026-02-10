import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PreviewModal from "./PreviewModal";

export default function Offers() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products/get")
      .then(res => setProducts(res.data.slice(0, 3))) // Just take 3 for offers
      .catch(err => console.error("Error fetching offers:", err));
  }, []);

  const openPreview = (item) => {
    setActiveProduct(item);
    setShowPreview(true);
  };

  const addToCart = (product) => {
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
        name: product.name || product.title,
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
      name: product.name || product.title,
      price: price,
      image: product.imageUrl || product.image,
      qty: 1
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(item));
    navigate("/checkout");
  };

  return (
    <section className="px-10 py-12 bg-white">
      <div className="grid grid-cols-3 gap-10">
        {products.map((item) => (
          <div
            key={item.id}
            className="
              group cursor-pointer
              bg-white rounded-2xl
              transition-all duration-500
              hover:-translate-y-3
              hover:shadow-2xl
            "
            onClick={() => openPreview(item)}
          >
            {/* IMAGE */}
            <div className="overflow-hidden rounded-2xl">
              <img
                src={item.imageUrl || item.image || "/default-image.jpg"}
                alt={item.name || item.title}
                className="
                  h-[320px] w-full object-cover
                  transition-transform duration-700
                  group-hover:scale-110
                "
              />
            </div>

            {/* TEXT */}
            <div className="mt-4 px-1">
              <h4 className="text-base font-semibold text-gray-800 transition-colors group-hover:text-black">
                {item.name || item.title}
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                {item.description || "Premium collection watch"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 PREVIEW MODAL */}
      {showPreview && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setShowPreview(false)}
          onAdd={addToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </section>
  );
}
