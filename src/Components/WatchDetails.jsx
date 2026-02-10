import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Reviews from "./Reviews";

export default function WatchDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;

  if (!product) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-2xl font-bold">Product info missing</h2>
        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-black text-white rounded-xl">Go Home</button>
      </div>
    );
  }

  const addToCart = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "add-to-cart", product } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const priceNum = Number(String(product.price).replace(/[₹,]/g, ""));
    const productId = Number(product.id);
    const found = cart.find((i) => Number(i.id) === productId);

    if (found) {
      found.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: priceNum,
        image: product.imageUrl || product.image,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  const handleBuyNow = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { state: { from: "buynow", product } });
      return;
    }
    const priceNum = Number(String(product.price).replace(/[₹,]/g, ""));
    const item = {
      id: Number(product.id),
      name: product.name,
      price: priceNum,
      image: product.imageUrl || product.image,
      qty: 1
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(item));
    navigate("/checkout");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">

        {/* IMAGE */}
        <div className="flex-1 bg-gray-50 rounded-[40px] p-12 flex items-center justify-center aspect-square shadow-sm">
          <img
            src={product.imageUrl || product.image || "/default-image.jpg"}
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition duration-500"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-8">
          <div>
            <p className="text-purple-600 font-bold uppercase tracking-widest mb-2">Luxury Edition</p>
            <h1 className="text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">{product.name}</h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-4xl font-black text-gray-900 border-r pr-6 border-gray-100">₹{product.price.toLocaleString()}</span>
            <span className="text-green-600 font-bold bg-green-50 px-4 py-1 rounded-full text-sm">In Stock & Ready to ship</span>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
            Witness the pinnacle of timekeeping. This premium watch combines historical heritage
            with modern precision engineering. Finished in high-grade materials for the discerning collector.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={addToCart}
              className="flex-1 bg-white text-black border-2 border-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition active:scale-95 shadow-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-purple-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-purple-800 transition active:scale-95 shadow-xl shadow-purple-200"
            >
              Instant Buy
            </button>
          </div>

          <div className="flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-wider pt-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Authenticity Guaranteed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Worldwide Shipping
            </div>
          </div>
        </div>
      </div>

      <Reviews productId={product.id} />

      <Footer />
    </div>
  );
}
