"use server"

import { createClient } from "@/utils/supabase/server"

export async function payBidDeposit({
  bidId,
  userId,
  eventId,
  amount,
}: {
  bidId: string
  userId: string
  eventId: string
  amount: number
}) {
  const supabase = await createClient()

  // Insert payment into payments table
  const { error: insertError } = await supabase.from("payments").insert({
    bid_id: bidId,
    user_id: userId,
    event_id: eventId,
    amount,
    payment_date: new Date(),
    status: "success",
  })

  if (insertError) {
    throw new Error(insertError.message)
  }

  // Update event's deposit_paid status to true
  const { error: updateError } = await supabase
    .from("events")
    .update({ deposit_paid: true })
    .eq("id", eventId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  return { success: true }
}
