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
  const supabase = await createClient();

  // 1. Fetch bookings with event info
  const { data: bookings, error } = await supabase
    .from("booking")
    .select(`
      id,
      event_id,
      user_id,
      date,
      location,
      status,
      created_at,
      negotiated_amount,
      events(
        id,
        name,
        price,
        user_id
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!bookings || bookings.length === 0) return [];

  // 2. Collect all unique user IDs (current user + organizer)
  const allUserIds = new Set<string>();
  bookings.forEach((b) => {
    allUserIds.add(b.user_id); // current user
    if (b.events?.user_id) allUserIds.add(b.events.user_id); // organizer
  });

  // 3. Fetch names from user_profiles (must match auth.users.id)
  const { data: usersData, error: usersError } = await supabase
    .from("user_profiles") // Your custom profile table
    .select("user_id, full_name")
    .in("user_id", Array.from(allUserIds));

  if (usersError) {
    throw new Error(usersError.message);
  }

  // 4. Build ID → name map
  const userMap = new Map(usersData.map((u) => [u.user_id, u.full_name]));

  // 5. Attach readable names to booking data
  const bookingsWithNames = bookings.map((b) => ({
    ...b,
    current_user_name: userMap.get(b.user_id) || "Unknown",
    organizer_name: userMap.get(b.events?.user_id ?? "") || "Unknown",
  }));

  return bookingsWithNames;
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
    user_id,
    events (
      name,
      price,
      user_id
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
