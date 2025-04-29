export type BookingStatus = "pending" | "confirmed" | "cancelled" | "paid";

export interface Booking {
  id: string;
  date: string;
  location: string;
  status: BookingStatus;
  created_at: string;
  negotiated_amount: number;
  event_id?: string;
  user_id?: string;
  events: {
    name: string;
    price: number;
  };
  user_profiles?: {
    full_name: string;
    email: string;
    avatar_url: string;
  }
}
