"use server";

import { Event } from "@/types/Event";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";


interface UploadResponse {
    success: boolean;
    error: string | null;
    imageUrl?: string;
    videoUrl?: string;
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
  
    // console.log("Image URL:", imageUrl);
  
    return { success: true, error: null, imageUrl };
}


export async function uploadEventVideo(file: File): Promise<UploadResponse> {
    if (!file) return { success: false, error: "No file provided" };
  
    const supabase = await createClient();
    const fileName = `${randomUUID()}-${file.name}`; // Unique file name
  
    // ✅ Upload file to Supabase Storage
    const {  error } = await supabase.storage
      .from("event-video") // ✅ Ensure this matches your actual bucket name
      .upload(`videos/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) return { success: false, error: error.message };
  
    // ✅ Correctly Get Public URL
    const { data: urlData } = supabase.storage
      .from("event-video")
      .getPublicUrl(`videos/${fileName}`);
  
    const videoUrl = urlData.publicUrl;
  
    console.log("VidEO URL:", videoUrl);
  
    return { success: true, error: null, videoUrl };
}

export async function addEvent({
  user_id,
  name,
  price,
  description,
  // long_description,
  // date,
  features,
  category_id,
  image,
  video,
  agendas,
  status = "approved", // Default status
}: Event ): Promise<EventResponse> {


  const supabase = await createClient();

  // ✅ Insert event into Supabase Database
  const { error: insertError } = await supabase.from("events").insert([
    {
      user_id: user_id,
      name: name,
      price,
      description,
      // long_description,
      // date,
      image: image || null,
      video: video || null,
      category_id: category_id,
      status,
      created_at: new Date(),
      features,
      agendas,
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
      .select("*") // ✅ Fetch only required fields
      .order("created_at", { ascending: false }); // ✅ Sort by latest products first
  
    if (error) {
      console.error("Error fetching events:", error.message);
      return [];
    }
  
    return data;
}

export async function getAllEventsExceptCurrentUser(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .neq("user_id", userId) // ✅ Exclude current user's events
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error.message);
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
    console.log("fvfv",eventId);
    
  
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
  
    if (error) {
      console.error("Error fetching event:", error.message);
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
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return data;
  }

  export async function getRelatedEvent(id: string) {
    const supabase = await createClient();
  
    // Fetch the event
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error || !event) return null;
  
    // Fetch related events (same category, exclude current event)
    const { data: relatedEvents } = await supabase
      .from("events")
      .select("*")
      .eq("category_id", event.category_id)
      .neq("id", id) // Exclude current event
      .limit(4); // Get only 4 related events
  
    return { ...event, relatedEvents: relatedEvents || [] };
  }
  

  export async function updateCategory(categoryId: string, categoryName: string) {
    const supabase = await createClient()
  
    const { error } = await supabase
      .from("categories")
      .update({ name: categoryName })
      .eq("id", categoryId)
  
    if (error) {
      console.error("Update error:", error)
      return { success: false, error: error.message }
    }
  
    return { success: true }
  }
  
  export async function deleteCategory(categoryId: string) {
    const supabase = await createClient()
  
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
  
    if (error) {
      console.error("Delete error:", error)
      return { success: false, error: error.message }
    }
  
    return { success: true }
  }

  export async function updateEventDetails(updatedEvent: Partial<Event> & { id: string }) {
    const supabase = await createClient()  
  
    const { error } = await supabase
      .from("events")
      .update({
        name: updatedEvent.name,
        price: updatedEvent.price,
        description: updatedEvent.description,
        category_id: updatedEvent.category_id,
        features: updatedEvent.features,
        image: updatedEvent.image,
        video: updatedEvent.video,
        agendas: updatedEvent.agendas,  
      })
      .eq("id", updatedEvent.id)
  
    if (error) {
      console.error("Update error:", error)
      return { success: false, error: error.message }
    }
  
    return { success: true }
  }
  