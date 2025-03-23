"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addEvent, getAllCategories, uploadEventImage } from "@/app/actions/event-actions";
import { createClient } from "@/utils/supabase/client";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// ✅ Define Zod schema for validation
const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters long."),
  price: z.string().min(1, "Price is required.").regex(/^\d+$/, "Price must be a valid number."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  categoryId: z.string().min(1, "Please select a category."),
  image: z.any().optional()
//   .any()
//   .refine((file) => file instanceof File, "Please upload a valid image file"),
});


export default function EventDialog({ onClose }: { onClose: () => void }) {
    
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // ✅ Fix: State to hold image file
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [ , setCategoryLoading] = useState(true);


    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(eventSchema),
    });

      // ✅ Fix: Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setValue("image", file instanceof File ? file : null); // ✅ Manually update form value with type check
  };


    // ✅ Fetch categories on mount from getAllCategories()
    useEffect(() => {
        async function fetchCategories() {
          setCategoryLoading(true);
          try {
            const data = await getAllCategories();
            setCategories(data);
          } catch (error) {
            console.log(error);
            
            toast.error("Failed to fetch categories.");
          } finally {
            setCategoryLoading(false);
          }
        }
        fetchCategories();
      }, []);

  const onSubmit = async (data: z.infer<typeof eventSchema>) => {
    setLoading(true);

    // ✅ Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      toast.error("User not authenticated!");
      setLoading(false);
      return;
    }

    let imageUrl = null;
    const file = data.image?.[0];

    // ✅ Upload image to Supabase Storage
    if (file) {
      const { success, error, imageUrl: uploadedImageUrl } = await uploadEventImage(file);
      if (!success) {
        console.log(error);
        
        toast.error(error || "Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = uploadedImageUrl;
    }

    // ✅ Insert product into database
    const { success, error } = await addEvent({
      userId: user.user.id,
      name: data.name,
      price: parseFloat(data.price),
      description: data.description,
      category_id: data.categoryId, // 🔹 Include selected category
      image: imageUrl || "",
    });

    if (!success) {
      toast.error(error || "Failed to add product");
    } else {
      toast.success("Event Created successfully!");
      reset();
    //   onEventAdded();
    }

    setLoading(false);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details below to create your event.</DialogDescription>
        </DialogHeader>

        {/* <Form {...form}> */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Event Name */}
            <div className="mb-4">
                <Label>Name</Label>
                <Input type="text" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
                <Label>Price</Label>
                <Input type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            {/* Event Category */}
            <div className="mb-4">
                <Label>Category</Label>
                <Select onValueChange={(value) => setValue("categoryId", value)}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                        {category.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
            </div>

            {/* Event Description */}
            <div className="mb-4">
                <Label>Description</Label>
                <Textarea {...register("description")} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Event Image Upload */}
            <div className="mb-4">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                {selectedFile && <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>}
                {errors.image && <p className="text-red-500 text-sm">{errors.image.message as string}</p>}
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="flex justify-between">
              <Button type="submit" variant={"default"} className="text-white" disabled={loading}>
              {loading ? "Adding..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        {/* </Form> */}
      </DialogContent>
    </Dialog>
  );
}
