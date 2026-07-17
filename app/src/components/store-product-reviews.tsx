"use client";

import { useState, useEffect } from "react";
import { Star, ShieldCheck } from "lucide-react";

type Review = {
  _id: string;
  productId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

type ProductReviewsProps = {
  productId: string;
  currentUserEmail?: string;
};

export default function ProductReviews({ productId, currentUserEmail }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) {
      setError("Please sign in to leave a review");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: form.rating, comment: form.comment }),
      });
      const data = await response.json();
      if (response.ok) {
        setReviews([data.review, ...reviews]);
        setForm({ rating: 5, comment: "" });
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Service unavailable");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={18} className={star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
            ))}
          </div>
          <span className="text-sm text-slate-600">{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
        </div>
      </div>

      {currentUserEmail && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Your Rating</label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="text-slate-400 hover:text-yellow-400">
                  <Star size={24} className={star <= form.rating ? "fill-yellow-400 text-yellow-400" : ""} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Your Review</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-teal-500 focus:outline-none"
              rows={3}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="rounded-full bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-600">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.userName}</p>
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      <ShieldCheck size={12} />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
