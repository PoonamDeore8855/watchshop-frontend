import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddToCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const updateQty = (id, value) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty + value } : item
      )
      .filter((i) => i.qty > 0);

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const moveToWishlist = (item) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.find((w) => w.id === item.id)) {
      wishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    removeItem(item.id);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="pt-28 pb-32 min-h-screen bg-gray-50 px-4">
      <h1 className="text-2xl font-semibold text-center mb-6">
        {/* ({cart.length}) */}
      </h1>

      {/* CART ITEMS */}
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow
                       flex gap-6 p-6"
          >
            {/* IMAGE – BIGGER */}
            <div className="w-80 h-75
                            flex items-center justify-center
                            bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain p-3"
              />
            </div>

            {/* INFO */}
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs text-gray-500 uppercase">
                New Men Watch
              </p>

              <p className="text-xl font-semibold">
                {item.name}
              </p>

              {/* PRICE */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl">
                  ₹{item.price}
                </span>
                <span className="text-sm line-through text-gray-400">
                  ₹{item.price + 500}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  20% OFF
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Free Delivery · 7 Days Replacement
              </p>

              {/* SIZE + QTY */}
              <div className="flex gap-4 mt-2 text-sm">
                <div className="border px-4 py-1.5 rounded">
                  Size: Free Size
                </div>

                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="px-4 py-1"
                  >
                    −
                  </button>
                  <span className="px-4">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="px-4 py-1"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Delivery by <b>Thursday, 05 Feb</b>
              </p>

              {/* ACTIONS */}
              <div className="flex gap-8 text-sm mt-3 text-gray-600">
                <button
                  onClick={() => moveToWishlist(item)}
                  className="hover:text-pink-600"
                >
                  ♡ Move to Wishlist
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="hover:text-red-600"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end">

            {/* RIGHT SIDE GROUP */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-xl font-bold">₹{total}</p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-purple-700 text-white
                   px-6 py-2
                   rounded-md text-sm font-medium
                   hover:bg-purple-800 transition"
              >
                Continue
              </button>
            </div>

          </div>
        </div>



      )}
    </div>
  );
}
