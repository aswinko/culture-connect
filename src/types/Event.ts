// Event interface
export interface Event {
  id?: string;
  userId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: string;
  status?: "pending" | "approved" | "rejected"; // Event approval status
  createdAt?: Date;

  // Existing
  location: string;
  features: string[];

  // New Fields
  long_description?: string;
  date?: Date;
  time?: string;
  capacity?: number;
  organizer?: string;

  starting_price: number;
  ending_price: number;
  current_bid: number;
  bidding_ends_at: Date;

  agendas?: string[]; // Can replace with a specific type/interface if known

  current_highest_bid?: number;
  current_highest_bidder_id?: string;
  number_of_bids: number;
}
