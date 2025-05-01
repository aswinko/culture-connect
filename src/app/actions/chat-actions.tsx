// app/actions/chat-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMessages(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function sendMessages({
  bookingId,
  senderId,
  receiverId,
  text,
}: {
  bookingId: string;
  senderId: string;
  receiverId: string;
  text: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    booking_id: bookingId,
    sender_id: senderId,
    receiver_id: receiverId,
    text,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
