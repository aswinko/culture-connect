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
  location?: string;
  features: string[];
  // New Fields
  long_description?: string;
  date?: Date;
  organizer?: string;
  agendas?: string[]; // Can replace with a specific type/interface if known
}
