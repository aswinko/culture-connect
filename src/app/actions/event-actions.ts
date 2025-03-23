"use server";

import { Event } from "@/types/Event";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";


interface UploadResponse {
    success: boolean;
    error: string | null;
    imageUrl?: string;
}

interface EventResponse {
    success: boolean;
    error: string | null;
    message?: string | null;
}


interface AddCategoryResponse {
    success: boolean;
    error: string | null;
    id?: string;
} 


export async function uploadEventImage(file: File): Promise<UploadResponse> {
    if (!file) return { success: false, error: "No file provided" };
  
    const supabase = await createClient();
    const fileName = `${randomUUID()}-${file.name}`; // Unique file name
  
    // ✅ Upload file to Supabase Storage
    const {  error } = await supabase.storage
      .from("event-image") // ✅ Ensure this matches your actual bucket name
      .upload(`images/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) return { success: false, error: error.message };
  
    // ✅ Correctly Get Public URL
    const { data: urlData } = supabase.storage
      .from("event-image")
      .getPublicUrl(`images/${fileName}`);
  
    const imageUrl = urlData.publicUrl;
  
    console.log("Image URL:", imageUrl);
  
    return { success: true, error: null, imageUrl };
}

export async function addEvent({
  userId,
  name,
  price,
  description,
  image,
  category_id,
  status = "approved", // Default status
}: Event ): Promise<EventResponse> {


  const supabase = await createClient();

  // ✅ Insert event into Supabase Database
  const { error: insertError } = await supabase.from("events").insert([
    {
      user_id: userId,
      name: name,
      price,
      description,
      image: image || null,
      category_id: category_id,
      status,
      created_at: new Date(),
    },
  ]);

  if (insertError) {
    console.error("Event upload failed:", insertError.message);
    return { success: false, error: "Failed to create event" };
  }

  return { success: true, error: null, message: "Event created successfully!" };
}

export async function getAllEvents() {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("events") // ✅ Ensure the correct table name
      .select("id, user_id, name, price, description, category_id, image, created_at") // ✅ Fetch only required fields
      .order("created_at", { ascending: false }); // ✅ Sort by latest products first
  
    if (error) {
      console.error("Error fetching products:", error.message);
      return [];
    }
  
    return data;
}
  


// ✅ Add Category Function
export async function addCategory(categoryName: string): Promise<AddCategoryResponse> {
    if (!categoryName.trim()) {
      return { success: false, error: "Category name is required" };
    }
  
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName }]) // 🛠️ Fixed name reference
      .select("id")
      .single();
  
    if (error) {
      console.error("Error adding category:", error.message);
      return { success: false, error: error.message };
    }
  
    return { success: true, error: null, id: data.id };
  }
  
  // ✅ Get All Categories
  export async function getAllCategories() {
    const supabase = await createClient();
  
    const { data, error } = await supabase.from("categories").select("id, name");
  
    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }
  
    return data;
  }
  
  
  export async function getCategoryById(categoryId: string) {
    
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", categoryId)
      .single(); // Fetch category name for given category_id
  
    if (error) {
      console.error("Error fetching category:", error.message);

      return null; // Default category if not found
    }
  
    return data;
  }

  export async function getEventById(eventId: string): Promise<Event | null> {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("events")
      .select("id, name, price, image, description, category_id")
      .eq("id", eventId)
      .single();
  
    if (error) {
      console.error("Error fetching product:", error.message);
      return null;
    }
  
    return data as Event;
  }


  export async function getUserEvents() {
    const supabase = await createClient();
  
    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      return { success: false, error: "User not authenticated." };
    }
  
    // Fetch events where user_id matches the current user
    const { data, error } = await supabase
      .from("events")
      .select("id, user_id, name, price, description, category_id, image, created_at")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return data;
  }