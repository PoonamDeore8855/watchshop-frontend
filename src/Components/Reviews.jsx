import React, { useState, useEffect } from "react";
import axios from "axios";

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/reviews/product/${productId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to leave a review");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post("/api/reviews", {
                productId: productId,
                userId: user.id,
                rating: rating,
                comment: comment
            });
            setComment("");
            setRating(5);
            fetchReviews();
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (count, interactive = false, currentRating = 0, setRate = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => setRate && setRate(star)}
                        className={`${star <= (interactive ? currentRating : count) ? "text-yellow-400" : "text-gray-300"} 
              ${interactive ? "hover:scale-125 transition-transform cursor-pointer" : "cursor-default"}`}
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="mt-20 border-t border-gray-100 pt-16 max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase tracking-tighter">Customer Reviews</h2>

            <div className="grid md:grid-cols-2 gap-16">
                {/* REVIEW FORM */}
                <div className="space-y-6">
                    <div className="bg-gray-50/50 backdrop-blur-sm p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Leave a Review</h3>
                        {!user ? (
                            <p className="text-gray-500 italic">Please sign in to share your experience with this timepiece.</p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Rating</label>
                                    {renderStars(0, true, rating, setRating)}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Experience</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all resize-none shadow-inner"
                                        placeholder="Tell us about the craftsmanship, feel, and precision..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Posting..." : "Submit Review"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* REVIEWS LIST */}
                <div className="space-y-8">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {reviews.map((review) => (
                                <div key={review.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.username}</h4>
                                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
};

export default Reviews;
