"use client"

import { useState, useEffect } from "react"
import { getReviews } from "@/app/actions/review-actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)
      const result = await getReviews()

      if (result.success && result.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = result.data.map((r: any) => ({
            id: r.id,
            name: r.name, // ✅ already returned from getReviews()
            rating: r.rating,
            comment: r.comment,
            date: r.date,
          }))
          
        setReviews(formatted)
      } else {
        console.error("Error fetching reviews:", result.error)
      }
      setLoading(false)
    }

    fetchReviews()
  }, [])

  const visibleReviews = showAll ? reviews : reviews.slice(0, 2)

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center">Customer Reviews</h3>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews yet.</p>
          ) : (
            <>
              <div className="space-y-6">
                {visibleReviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-md shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex gap-0.5 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>

              {reviews.length > 3 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show Less" : `Show ${reviews.length - 2} More`}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
