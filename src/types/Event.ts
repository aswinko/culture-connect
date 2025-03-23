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
  }