// "use server";

// import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from "next/cache";

// interface BidWithEvent {
//   id: string;
//   bid_amount: number;
//   created_at: string;
//   event_id: string;
//   user_id: string;
//   events: {
//     name: string;
//     image: string;
//     date: string;
//     starting_price: number;
//     ending_price: number;
//     bidding_ends_at: string;
//     current_highest_bid: number;
//     current_bid: number;
//     deposit_paid: boolean;
//     status?: string; 
//   };
// }

// export async function placeBid(
//   eventId: string,
//   amount: number,
//   userId: string
// ) {
//   const supabase = await createClient();

//   try {
//     // 1. Fetch current event data
//     const { data: event, error: fetchError } = await supabase
//       .from("events")
//       .select("current_bid, bidding_ends_at, number_of_bids")
//       .eq("id", eventId)
//       .single();

//     if (fetchError) throw new Error(fetchError.message);
//     if (!event) throw new Error("Event not found");

//     const now = new Date();
//     if (event.bidding_ends_at && new Date(event.bidding_ends_at) < now) {
//       throw new Error("Bidding has ended for this event.");
//     }

//     if (amount <= (event.current_bid ?? 0)) {
//       throw new Error("Bid must be higher than the current bid.");
//     }

//     // 2. Insert into bids table
//     const { error: insertError } = await supabase.from("bids").insert({
//       event_id: eventId,
//       user_id: userId,
//       bid_amount: amount,
//     });

//     if (insertError) throw new Error(insertError.message);

//     // 3. Update event's current_bid, highest bidder, and bid count
//     const { error: updateError } = await supabase
//       .from("events")
//       .update({
//         current_bid: amount,
//         current_highest_bid: amount,
//         current_highest_bidder_id: userId,
//         number_of_bids: (event.number_of_bids ?? 0) + 1,
//       })
//       .eq("id", eventId);

//     if (updateError) throw new Error(updateError.message);

//     // 4. Revalidate path to reflect changes
//     revalidatePath(`/event/${eventId}`);

//     return { success: true };
//   } catch (error) {
//     console.error("Bid Error:", error);
//     return {
//       success: false,
//       message: (error as Error).message || "Failed to place bid.",
//     };
//   }
// }

// export async function getBids(eventId: string) {
//   const supabase = await createClient();

//   try {
//     // 1. Fetch all bids for the event
//     const { data: bidsRaw, error: bidsError } = await supabase
//       .from("bids")
//       .select("id, bid_amount, created_at, user_id")
//       .eq("event_id", eventId)
//       .order("created_at", { ascending: false });

//     if (bidsError) throw new Error(bidsError.message);
//     if (!bidsRaw) return { success: true, bids: [] };

//     // 2. Extract unique userIds
//     const userIds = [...new Set(bidsRaw.map((b) => b.user_id))];

//     // 3. Fetch user names from user_profiles table
//     const { data: userProfiles, error: usersError } = await supabase
//       .from("user_profiles") // You can rename this if you use a different table
//       .select("id, full_name, user_id")
//       .in("user_id", userIds);

//     if (usersError) throw new Error(usersError.message);

//     const highestAmount = Math.max(...bidsRaw.map((b) => b.bid_amount));

//     // 4. Map and format final bid listA
//     const bids = bidsRaw.map((bid) => {
//       const user = userProfiles?.find((u) => u.user_id === bid.user_id);

//       return {
//         id: bid.id,
//         userId: bid.user_id,
//         userName: user?.full_name ?? "Anonymous",
//         amount: bid.bid_amount,
//         time: new Date(bid.created_at),
//         status: bid.bid_amount === highestAmount ? "highest" : "outbid",
//       };
//     });

//     return { success: true, bids };
//   } catch (err) {
//     console.error("Error fetching bids:", err);
//     return {
//       success: false,
//       message: (err as Error).message || "Failed to fetch bids.",
//     };
//   }
// }

// export async function getAllLatestBidsOfUser(userId: string) {
//   const supabase = await createClient();

//   try {
//     // Step 1: Fetch latest bids by user for each event
//     const { data: userBids, error: bidsError } = (await supabase
//       .from("bids")
//       .select(
//         `
//           id,
//           bid_amount,
//           created_at,
//           event_id,
//           user_id,
//           events (
//             name,
//             image,
//             date,
//             starting_price,
//             ending_price,
//             bidding_ends_at,
//             current_highest_bid,
//             current_bid,
//             deposit_paid
//           )
//         `
//       )
//       .eq("user_id", userId)
//       .order("created_at", { ascending: false })) as {
//       data: BidWithEvent[] | null;
//       error: { message: string } | null;
//     };

//     if (bidsError) throw new Error(bidsError.message);
//     if (!userBids || userBids.length === 0) return { success: true, bids: [] };

//     // Step 2: Get unique latest bids per event for this user
//     const latestBidsByEvent = Object.values(
//       userBids.reduce((acc, bid) => {
//         if (!acc[bid.event_id]) {
//           acc[bid.event_id] = bid;
//         }
//         return acc;
//       }, {} as Record<string, BidWithEvent>)
//     );

//     // Step 3: Fetch highest bid for each event
//     const eventIds = latestBidsByEvent.map((b) => b.event_id);
//     const { data: allBids, error: allBidsError } = await supabase
//       .from("bids")
//       .select("bid_amount, event_id")
//       .in("event_id", eventIds);

//     if (allBidsError) throw new Error(allBidsError.message);

//     const highestBidsMap = allBids.reduce((acc, bid) => {
//       if (!acc[bid.event_id] || bid.bid_amount > acc[bid.event_id]) {
//         acc[bid.event_id] = bid.bid_amount;
//       }
//       return acc;
//     }, {} as Record<string, number>);

//     // Step 4: Final mapping with status and formatted fields
//     const bids = latestBidsByEvent.map((bid) => {
//       const highest = highestBidsMap[bid.event_id];
//       const status = bid.bid_amount === highest ? "highest" : "outbid";

//       return {
//         id: bid.id,
//         amount: bid.bid_amount,
//         time: new Date(bid.created_at),
//         status,
//         eventId: bid.event_id,
//         event: {
//           name: bid.events?.name,
//           image: bid.events?.image,
//           date: bid.events?.date,
//           biddingEndsAt: bid.events?.bidding_ends_at,
//           startingPrice: bid.events?.starting_price,
//           endingPrice: bid.events?.ending_price,
//           currentHighestBid: bid.events?.current_highest_bid,
//           currentBid: bid.events?.current_bid,
//           depositPaid: bid.events?.deposit_paid,
//         },
//       };
//     });

//     return { success: true, bids };
//   } catch (err) {
//     console.error("Error fetching latest user bids:", err);
//     return {
//       success: false,
//       message: (err as Error).message,
//     };
//   }
// }


// export async function getAllLatestBids() {
//   const supabase = await createClient();

//   try {
//     // Step 1: Fetch latest bids by user for each event
//     const { data: userBids, error: bidsError } = (await supabase
//       .from("bids")
//       .select(
//         `
//           id,
//           bid_amount,
//           created_at,
//           event_id,
//           user_id,
//           events (
//             name,
//             image,
//             date,
//             starting_price,
//             ending_price,
//             bidding_ends_at,
//             current_highest_bid,
//             current_bid,
//             deposit_paid,
//             status
//           )
//         `
//       )
//       .order("created_at", { ascending: false })) as {
//       data: BidWithEvent[] | null;
//       error: { message: string } | null;
//     };

//     if (bidsError) throw new Error(bidsError.message);
//     if (!userBids || userBids.length === 0) return { success: true, bids: [] };

//     // Step 2: Get unique latest bids per event for this user
//     const latestBidsByEvent = Object.values(
//       userBids.reduce((acc, bid) => {
//         if (!acc[bid.event_id]) {
//           acc[bid.event_id] = bid;
//         }
//         return acc;
//       }, {} as Record<string, BidWithEvent>)
//     );

//     // Step 3: Fetch highest bid for each event
//     const eventIds = latestBidsByEvent.map((b) => b.event_id);
//     const { data: allBids, error: allBidsError } = await supabase
//       .from("bids")
//       .select("bid_amount, event_id")
//       .in("event_id", eventIds);

//     if (allBidsError) throw new Error(allBidsError.message);

//     const highestBidsMap = allBids.reduce((acc, bid) => {
//       if (!acc[bid.event_id] || bid.bid_amount > acc[bid.event_id]) {
//         acc[bid.event_id] = bid.bid_amount;
//       }
//       return acc;
//     }, {} as Record<string, number>);

//     // Step 4: Final mapping with status and formatted fields
//     const bids = latestBidsByEvent.map((bid) => {
//       const highest = highestBidsMap[bid.event_id];
//       const status = bid.bid_amount === highest ? "highest" : "outbid";

//       return {
//         id: bid.id,
//         amount: bid.bid_amount,
//         time: new Date(bid.created_at),
//         status,
//         eventId: bid.event_id,
//         event: {
//           name: bid.events?.name,
//           image: bid.events?.image,
//           date: bid.events?.date,
//           biddingEndsAt: bid.events?.bidding_ends_at,
//           startingPrice: bid.events?.starting_price,
//           endingPrice: bid.events?.ending_price,
//           currentHighestBid: bid.events?.current_highest_bid,
//           currentBid: bid.events?.current_bid,
//           depositPaid: bid.events?.deposit_paid,
//           status: bid.events?.status,
//         },
//       };
//     });

//     return { success: true, bids };
//   } catch (err) {
//     console.error("Error fetching latest user bids:", err);
//     return {
//       success: false,
//       message: (err as Error).message,
//     };
//   }
// }