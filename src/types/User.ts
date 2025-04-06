export type UserRole = 'user' | 'admin';

export interface User {
  id?: string;
  user_id?: string;
  full_name?: string;
  phone: string;
  email: string;
  bio?: string;
  role?: UserRole;
} 