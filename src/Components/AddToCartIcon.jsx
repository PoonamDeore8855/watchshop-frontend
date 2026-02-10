import { Link } from "react-router-dom";

export default function AddToCartIcon({ cartItems }) {
  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-10 h-10 text-black hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-full transition-all group"
    >
      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {cartItems.length > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 bg-red-600 text-white
          text-[8px] w-3.5 h-3.5 flex items-center justify-center
          rounded-full font-black shadow-[0_0_8px_rgba(220,38,38,0.4)] animate-in fade-in zoom-in duration-300"
        >
          {cartItems.length}
        </span>
      )}
    </Link>
  );
}
