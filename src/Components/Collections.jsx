import { useNavigate } from "react-router-dom";
import { useState } from "react";
import watch1 from "../assets/watch1.jpg";
import watch2 from "../assets/watch2.jpg";
import watch3 from "../assets/watch3.jpg";
import PreviewModal from "./PreviewModal";

export default function Collections() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const products = [
    { id: 1, name: "Premium Watch", price: 12000, image: watch1 },
    { id: 2, name: "Luxury Watch", price: 18500, image: watch2 },
    { id: 3, name: "Classic Watch", price: 9800, image: watch3 },
  ];

  const openPreview = (item) => {
    setActiveProduct(item);
    setShowPreview(true);
  };

  const addToCart = (item) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "add-to-cart", product: item } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...item, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <div className="px-10 pt-28 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-10">
        Watch Collections
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {products.map(item => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <img
              src={item.image}
              onClick={() => openPreview(item)}
              className="cursor-pointer h-56 w-full object-cover rounded"
            />

            <h3 className="mt-3 text-center font-semibold">
              {item.name}
            </h3>
            <p className="text-center">
              ₹{item.price}
            </p>
          </div>
        ))}
      </div>

      {showPreview && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setShowPreview(false)}
          onAdd={() => addToCart(activeProduct)}
        />
      )}
    </div>
  );
}
