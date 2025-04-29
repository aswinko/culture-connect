// /app/actions/review-actions.ts

"use server"

import { createClient } from "@/utils/supabase/server"


export async function addReview({
  bookingId,
  userId,
  review,
  rating,
}: {
  bookingId: string
  userId: string
  review: string
  rating: number
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reviews")
    .insert([{ booking_id: bookingId, user_id: userId, review, rating }])

  if (error) {
    console.error("Error submitting review:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}


// ✅ Get all reviews
export async function getReviews() {
    const supabase = await createClient()
  
    // Step 1: Fetch reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        id,
        review,
        rating,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false })
  
    if (reviewsError) return { success: false, error: reviewsError.message }
  
    // Step 2: Fetch full_name for each user_id from user_profiles
    const reviewsWithNames = await Promise.all(
      reviewsData.map(async (review) => {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("user_id", review.user_id) // 👈 match the user_id
          .single()
  
        return {
          id: review.id,
          name: profileData?.full_name || "Anonymous",
          rating: review.rating,
          comment: review.review,
          date: new Date(review.created_at).toLocaleDateString(),
        }
      })
    )
  
    return { success: true, data: reviewsWithNames }
  }
  