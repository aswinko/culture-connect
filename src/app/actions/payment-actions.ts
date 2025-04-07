"use server";

import { createClient } from "@/utils/supabase/server";

type Payment = {
  order_id: string;
  payment_id: string;
  signature: string;
  status: string;
  booking_id: string;
  event_id: string;
  user_id: string;
  advance_amount: number;
};

export async function createPayment(payment: Payment) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("payments").insert([payment]);

  if (error) {
    return { data, error };
  }

  // Update booking status to "paid"
  const { error: bookingError } = await supabase
    .from("booking")
    .update({ status: "paid" })
    .eq("id", payment.booking_id);

  return { data, error: bookingError };
}

export async function getAllPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error.message);
      return [];
    }
  
    return data;
}
