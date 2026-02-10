import { useState, useEffect } from "react";

export default function WishlistButton({ product, className = "" }) {
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Check if product is in wishlist
    useEffect(() => {
        checkWishlistStatus();

        // Listen for wishlist updates
        const handleWishlistUpdate = () => checkWishlistStatus();
        window.addEventListener("wishlistUpdated", handleWishlistUpdate);
        window.addEventListener("storage", handleWishlistUpdate);

        return () => {
            window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
            window.removeEventListener("storage", handleWishlistUpdate);
        };
    }, [product.id]);

    const checkWishlistStatus = () => {
        try {
            const storedWishlist = localStorage.getItem("wishlist");
            const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
            setIsInWishlist(wishlist.some((item) => item.id === product.id));
        } catch (err) {
            setIsInWishlist(false);
        }
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const storedWishlist = localStorage.getItem("wishlist");
            let wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

            if (isInWishlist) {
                // Remove from wishlist
                wishlist = wishlist.filter((item) => item.id !== product.id);
            } else {
                // Add to wishlist
                wishlist.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || product.imageUrl,
                });
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            setIsInWishlist(!isInWishlist);

            // Dispatch event to notify other components
            window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (err) {
            console.error("Wishlist error:", err);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`group transition-all duration-300 ${className}`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            {isInWishlist ? (
                // Filled heart
                <svg
                    className="w-6 h-6 text-red-500 fill-current transform group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ) : (
                // Outlined heart
                <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all stroke-current fill-none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            )}
        </button>
    );
}
