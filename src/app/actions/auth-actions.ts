"use server";

import { User } from "@/types/User";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface AuthResponse {
  error: null | string;
  success: boolean;
  data: unknown | null;
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  // Check if user already exists
  const { data: existingUser, error: userCheckError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return {
      error: "User already exists!",
      success: false,
      data: null,
    };
  }

  if (userCheckError && userCheckError.code !== "PGRST116") {
    return {
      error: "Error checking user existence!",
      success: false,
      data: null,
    };
  }

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
    },
  };

  const { data: signupData, error } = await supabase.auth.signUp(data);

  if (error || !signupData?.user) {
    return {
      error: error?.message || "There was an error signing up!",
      success: false,
      data: null,
    };
  }

  // Insert into user_profiles table
  const { error: profileError } = await supabase.from("user_profiles").insert([
    {
      user_id: signupData.user.id,
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") || null,
      bio: formData.get("bio") || null,
      // avatar_url: formData.get("avatar_url") || null,
      role: formData.get("role") || "user",
      created_at: new Date(),
    },
  ]);

  if (profileError) {
    return {
      error: profileError.message || "Failed to create user profile!",
      success: false,
      data: null,
    };
  }

  return {
    error: null,
    success: true,
    data: signupData,
  };
}

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signInData, error: authError } =
    await supabase.auth.signInWithPassword(data);

  if (authError || !signInData?.user) {
    return {
      error: authError?.message || "There was an error logging in!",
      success: false,
      data: null,
    };
  }

  const userId = signInData.user.id;
  // ✅ Fetch user role from `user_roles`
  const { data: userRoleData, error: roleError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (roleError || !userRoleData) {
    return {
      error: "User role not found!",
      success: false,
      data: null,
    };
  }

  return {
    success: true,
    data: { userId, role: userRoleData.role },
    error: null,
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUserProfile() {
  const supabase = await createClient();

  // Get the currently authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError?.message);
    return null;
  }

  // Fetch user profile from `user_profiles` table
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("full_name, email, phone, bio, role, created_at")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
    return null;
  }

  return profile;
}

export async function getUserRole(): Promise<string | null> {
  const supabase = await createClient();

  // ✅ Get authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("User not found:", userError?.message);
    return null;
  }

  const userId = userData.user.id;

  // ✅ Fetch user role from `user_roles`
  const { data: roleData, error: roleError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (roleError || !roleData) {
    console.error("Error fetching user role:", roleError?.message);
    return null;
  }

  return roleData.role;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  // ✅ Get authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error("Error fetching current user:", authError?.message);
    return null;
  }

  const userId = authData.user.id;

  // ✅ Fetch user details from `user_profiles`
  const { data: userProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id, full_name, email, phone, bio, created_at")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
    return null;
  }

  return userProfile;
}

export async function getAllUsers(): Promise<User[] | null> {
  const supabase = await createClient();

  // Fetch users along with their roles
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*");

  if (error || !data) {
    console.error("Error fetching users:", error.message);
    return null;
  }

  return data;
}

export async function getAllUserRoles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, role");

  if (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }

  return data; // Array of { user_id, role }
}

export async function getUserById(id: string): Promise<User[] | null> {
  const supabase = await createClient();

  // Fetch users along with their roles
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", id);

  if (error || !data) {
    console.error("Error fetching users:", error.message);
    return null;
  }

  return data;
}


export async function updateUserStatus(userId: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_profiles")
    .update({ status: newStatus })
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to update user status:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}


export async function updateUserProfile(
  userId: string,
  formData: FormData
): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      bio: formData.get("bio"),
    })
    .eq("user_id", userId);

  if (error) {
    return {
      error: error.message,
      success: false,
      data: null,
    };
  }

  return {
    error: null,
    success: true,
    data: null,
  };
}