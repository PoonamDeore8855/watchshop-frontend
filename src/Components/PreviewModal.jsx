import { useNavigate } from "react-router-dom";

export default function PreviewModal({ product, onClose, onAdd, onBuyNow }) {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition z-10 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* IMAGE */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
          <img
            src={product.imageUrl || product.image || "/default-image.jpg"}
            className="max-h-[400px] w-full object-contain hover:scale-105 transition duration-500"
            alt={product.name}
          />
        </div>

        {/* CONTENT */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {product.name || product.title}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-purple-600">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Experience timeless elegance with our premium collection.
            Crafted with precision and designed for those who value sophistication.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onAdd(product);
                onClose();
              }}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg active:scale-95"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                if (onBuyNow) onBuyNow(product);
                else onAdd(product);
                onClose();
              }}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition shadow-lg active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
