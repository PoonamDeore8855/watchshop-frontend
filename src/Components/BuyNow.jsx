import { useNavigate } from "react-router-dom";

export default function BuyNow() {
  const navigate = useNavigate();
  const product = JSON.parse(localStorage.getItem("buyNowProduct"));

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // const product = cart[0];

  if (!product) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-2xl font-semibold mb-3">
          No product selected
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white rounded"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-semibold mb-6">
          Buy Now
        </h2>

        <div className="flex gap-6">
          <img
            src={product.image}
            className="w-56 h-56 object-cover rounded"
          />

          <div>
            <h3 className="text-xl font-semibold">
              {product.name}
            </h3>

            <p className="text-lg font-bold mt-2">
              ₹{product.price}
            </p>

            <p className="text-sm text-gray-500 mt-3">
              Free Delivery • COD Available
            </p>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 px-8 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
