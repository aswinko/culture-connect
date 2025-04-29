"use client"

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { addReview } from "@/app/actions/review-actions";

export function ReviewForm({ bookingId, userId }: { bookingId: string; userId: string }) {
    const [reviewText, setReviewText] = useState("")
    const [rating, setRating] = useState(0)
    const [loading, setLoading] = useState(false)
  
    const handleSubmit = async () => {
      if (!reviewText.trim() || rating === 0) {
        toast.error("Please provide both a review and a rating.")
        return
      }
  
      setLoading(true)
  
      const res = await addReview({ bookingId, userId, review: reviewText, rating })
  
      if (res.success) {
        toast.success("Review submitted successfully!")
        setReviewText("")
        setRating(0)
      } else {
        toast.error(res.error || "Failed to submit review.")
      }
  
      setLoading(false)
    }
  
    return (
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
  
        {/* Star Rating */}
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>
  
        {/* Textarea */}
        <textarea
          className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Write your review here..."
          rows={3}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
  
        <Button
          variant="default"
          className="mt-2 w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    )
  }
  