"use server"

import { createClient } from "@/utils/supabase/server"

export async function createBooking({
  name,
  address,
  location,
  location_cords,
  date,
  negotiatedAmount,
  eventId,
  userId,
}: {
  name: string
  address: string
  location: string
  date: string
  negotiatedAmount: number
  eventId: string
  userId: string
  location_cords: {
    lat: number;
    lng: number;
  }
}) {
  const supabase = await createClient()


  const { error } = await supabase.from("booking").insert({
    name,
    address,
    location,
    location_cords,
    date,
    negotiated_amount: negotiatedAmount,
    event_id: eventId,
    user_id: userId,
    status: "pending",
  })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}


export async function getBookingsByCurrentUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("booking")
    .select(
      `id, event_id, user_id, events(name, price), date, location, status, created_at, negotiated_amount`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }
  

  return data
}

export const getEventBookingsForOrganizer = async (organizerId: string) => {
  const supabase = await createClient();

  // Step 1: Get all event IDs created by the organizer
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id")
    .eq("user_id", organizerId);

  if (eventsError || !events) {
    console.error("Failed to fetch events", eventsError);
    return [];
  }

  const eventIds = events.map((event) => event.id);
  if (eventIds.length === 0) return [];

  // Step 2: Get bookings with user info from `user_profiles`
  const { data: bookings, error } = await supabase
  .from("booking")
  .select(`
    id,
    status,
    negotiated_amount,
    created_at,
    event_id,
    location,
    created_at,
    date,
    events (
      name,
      price
    ),
    user_profiles (
      full_name,
      email,
      avatar_url
    )
  `)
  .in("event_id", eventIds);


  if (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }

  return bookings;
};


export const updateBookingStatus = async (bookingId: string, newStatus: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("booking")
    .update({
      status: newStatus,
    })
    .eq("id", bookingId);

  if (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status.");
  }

  return true;
};
