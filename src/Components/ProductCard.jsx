import { useNavigate } from "react-router-dom";
import { useState } from "react";
import productsData from "../data/productsData";
import Footer from "./Footer";

export default function Products() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const checkLogin = (item, from) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from, product: item } });
      return false;
    }
    return true;
  };

  const openPreview = (product) => {
    setActiveProduct(product);
    setShowPreview(true);
  };

  const handleAddToCart = (item) => {
    if (!checkLogin(item, "add-to-cart")) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const price = Number(String(item.price).replace(/[₹,]/g, ""));

    const existing = cart.find(p => p.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, price, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  return (
    <section className="bg-gray-50 pt-10">

      <h1 className="text-3xl font-bold text-center mb-6">
        Trending Products
      </h1>

      <div className="grid grid-cols-3 gap-10 px-6">
        {productsData.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-2xl shadow hover:-translate-y-2 transition">
            <img
              src={product.image}
              onClick={() => openPreview(product)}
              className="cursor-pointer h-60 w-full object-cover rounded-xl hover:scale-105 transition"
            />

            <h4 className="mt-4 font-semibold">{product.name}</h4>
            <p className="text-gray-500">₹{product.price}</p>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-full text-xs"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && activeProduct && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setShowPreview(false)}
          onAdd={() => handleAddToCart(activeProduct)}
        />
      )}

      <Footer />
    </section>
  );
}
