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
import { addEvent, getAllCategories, uploadEventImage, uploadEventVideo } from "@/app/actions/event-actions";
import { createClient } from "@/utils/supabase/client";

// ✅ Define Zod schema for validation
const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters long."),
  price: z.string().min(1, "Price is required.").regex(/^\d+$/, "Price must be a valid number."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  // long_description: z.string().min(10, "Long description must be at least 10 characters long."),
  features: z.array(z.string().min(2, "Each feature must have at least 2 characters.")).min(1, "At least one feature is required."),
  agendas: z.array(z.string().min(2, "Each agenda must have at least 2 characters.")).min(1, "At least one agenda is required."),
  categoryId: z.string().min(1, "Please select a category."),
  // date: z.string().min(1, "Date is required."),
  image: z.any().refine((files) => files?.[0] instanceof File, "Please select a valid file."),
  video: z.any().refine((files) => files?.[0] instanceof File, "Please select a valid file."),
});


export default function EventDialog({ onClose }: { onClose: () => void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [, setCategoryLoading] = useState(true);
  const [features, setFeatures] = useState<string[]>([]);
  const [agendas, setAgendas] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [agendaInput, setAgendaInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: { features: [] }, // ✅ Ensure features field is initialized
  });

  const fileRef = register("image");
  const videoRef = register("video");

  // ✅ Fetch categories on mount
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

  const handleAddFeature = () => {
    if (featureInput.trim().length > 1) {
      const updatedFeatures = [...features, featureInput.trim()];
      setFeatures(updatedFeatures);
      setValue("features", updatedFeatures); // ✅ Sync with react-hook-form
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    setValue("features", updatedFeatures); // ✅ Sync with react-hook-form
  };

  const handleAddAgenda = () => {
    if (agendaInput.trim().length > 1) {
      const updatedAgendas = [...agendas, agendaInput.trim()];
      setAgendas(updatedAgendas);
      setValue("agendas", updatedAgendas); // ✅ Sync with react-hook-form
      setFeatureInput("");
    }
  };
  
  const handleRemoveAgenda = (index: number) => {
    const updatedAgenda = agendas.filter((_, i) => i !== index);
    setAgendas(updatedAgenda);
    setValue("agendas", updatedAgenda); // ✅ Sync with react-hook-form
  };

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
    let videoUrl = null;
    const file = data.image?.[0];
    const videoFile = data.video?.[0];

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


    // ✅ Upload image to Supabase Storage
    if (videoFile) {
      const { success, error, videoUrl: uploadedVideoUrl } = await uploadEventVideo(videoFile);
      if (!success) {
        console.log(error);
        toast.error(error || "Video upload failed");
        setLoading(false);
        return;
      }
      videoUrl = uploadedVideoUrl;
    }

    // ✅ Insert event into database
    const { success, error } = await addEvent({
      user_id: user.user.id,
      name: data.name,
      price: parseFloat(data.price),
      description: data.description,
      // long_description: data.long_description,
      // date: new Date(data.date),
      features,
      agendas,
      category_id: data.categoryId,
      image: imageUrl || "",
      video: videoUrl || "",
    });
    

    if (!success) {
      toast.error(error || "Failed to add event");
    } else {
      toast.success("Event Created successfully!");
      reset();
      setFeatures([]); // Clear features
      setAgendas([]); // Clear agendas
    }

    setLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[99vh] overflow-y-auto custom-scroll">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details below to create your event.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Event Name */}
          <div className="mb-4">
            <Label>Name</Label>
            <Input type="text" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Event Price */}
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

          {/* Event Features */}
          <div className="mb-4">
            <Label>Event Highlights</Label>
            <div className="flex gap-2">
              <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature" />
              <Button type="button" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            {features.length > 0 && (
              <ul className="mt-2 space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)}>
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {errors.features && <p className="text-red-500 text-sm">{errors.features.message as string}</p>}
          </div>

          {/* Event Agenda */}
          <div className="mb-4">
            <Label>Event Agendas</Label>
            <div className="flex gap-2">
              <Input value={agendaInput} onChange={(e) => setAgendaInput(e.target.value)} placeholder="Add a agenda" />
              <Button type="button" onClick={handleAddAgenda}>
                Add
              </Button>
            </div>
            {agendas.length > 0 && (
              <ul className="mt-2 space-y-1">
                {agendas.map((agenda, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    {agenda}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveAgenda(index)}>
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {errors.agendas && <p className="text-red-500 text-sm">{errors.agendas.message as string}</p>}
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
            <Input type="file" accept="image/*" {...fileRef} />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message as string}</p>}
          </div>

          {/* Event Videp Upload */}
          <div className="mb-4">
            <Label>Video</Label>
            <Input type="file" accept="video/*" {...videoRef} />
            {errors.video && <p className="text-red-500 text-sm">{errors.video.message as string}</p>}
          </div>

          {/* Long Description */}
          {/* <div className="mb-4">
            <Label>Long Description</Label>
            <Textarea {...register("long_description")} />
            {errors.long_description && <p className="text-red-500 text-sm">{errors.long_description.message}</p>}
          </div> */}

          {/* Date */}
          {/* <div className="mb-4">
            <Label>Date</Label>
            <Input type="date" {...register("date")} />
            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
          </div> */}


          {/* Footer Buttons */}
          <DialogFooter className="flex justify-between">
            <Button type="submit" variant={"default"} className="text-white" disabled={loading}>
              {loading ? "Adding..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// "use client";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { addEvent, getAllCategories, uploadEventImage } from "@/app/actions/event-actions";
// import { createClient } from "@/utils/supabase/client";

// // ✅ Define Zod schema for validation
// const eventSchema = z.object({
//   name: z.string().min(3, "Event name must be at least 3 characters long."),
//   price: z.string().min(1, "Price is required.").regex(/^\d+$/, "Price must be a valid number."),
//   description: z.string().min(10, "Description must be at least 10 characters long."),
//   location: z.string().min(3, "Location must be specified."),
//   features: z.array(z.string().min(2, "Each feature must have at least 2 characters.")).min(1, "At least one feature is required."),
//   categoryId: z.string().min(1, "Please select a category."),
//   image: z.any().refine((files) => files?.[0] instanceof File, "Please select a valid file."),
// });

// export default function EventDialog({ onClose }: { onClose: () => void }) {
//   const supabase = createClient();
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
//   const [, setCategoryLoading] = useState(true);
//   const [features, setFeatures] = useState<string[]>([]);
//   const [featureInput, setFeatureInput] = useState("");

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(eventSchema),
//     defaultValues: { features: [] }, // ✅ Ensure features field is initialized
//   });

//   const fileRef = register("image");

//   // ✅ Fetch categories on mount
//   useEffect(() => {
//     async function fetchCategories() {
//       setCategoryLoading(true);
//       try {
//         const data = await getAllCategories();
//         setCategories(data);
//       } catch (error) {
//         console.log(error);
//         toast.error("Failed to fetch categories.");
//       } finally {
//         setCategoryLoading(false);
//       }
//     }
//     fetchCategories();
//   }, []);

//   const handleAddFeature = () => {
//     if (featureInput.trim().length > 1) {
//       const updatedFeatures = [...features, featureInput.trim()];
//       setFeatures(updatedFeatures);
//       setValue("features", updatedFeatures); // ✅ Sync with react-hook-form
//       setFeatureInput("");
//     }
//   };
  
//   const handleRemoveFeature = (index: number) => {
//     const updatedFeatures = features.filter((_, i) => i !== index);
//     setFeatures(updatedFeatures);
//     setValue("features", updatedFeatures); // ✅ Sync with react-hook-form
//   };

//   const onSubmit = async (data: z.infer<typeof eventSchema>) => {
//     setLoading(true);

//     // ✅ Get current user
//     const { data: user, error: userError } = await supabase.auth.getUser();
//     if (userError || !user?.user) {
//       toast.error("User not authenticated!");
//       setLoading(false);
//       return;
//     }

//     let imageUrl = null;
//     const file = data.image?.[0];

//     // ✅ Upload image to Supabase Storage
//     if (file) {
//       const { success, error, imageUrl: uploadedImageUrl } = await uploadEventImage(file);
//       if (!success) {
//         console.log(error);
//         toast.error(error || "Image upload failed");
//         setLoading(false);
//         return;
//       }
//       imageUrl = uploadedImageUrl;
//     }

//     // ✅ Insert event into database
//     const { success, error } = await addEvent({
//       userId: user.user.id,
//       name: data.name,
//       price: parseFloat(data.price),
//       description: data.description,
//       location: data.location,
//       features,
//       category_id: data.categoryId,
//       image: imageUrl || "",
//     });

//     if (!success) {
//       toast.error(error || "Failed to add event");
//     } else {
//       toast.success("Event Created successfully!");
//       reset();
//       setFeatures([]); // Clear features
//     }

//     setLoading(false);
//   };

//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-lg max-h-[99vh] overflow-y-auto custom-scroll">
//         <DialogHeader>
//           <DialogTitle>Create New Event</DialogTitle>
//           <DialogDescription>Fill in the details below to create your event.</DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           {/* Event Name */}
//           <div className="mb-4">
//             <Label>Name</Label>
//             <Input type="text" {...register("name")} />
//             {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//           </div>

//           {/* Event Location */}
//           <div className="mb-4">
//             <Label>Location</Label>
//             <Input type="text" {...register("location")} />
//             {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//           </div>

//           {/* Event Price */}
//           <div className="mb-4">
//             <Label>Price</Label>
//             <Input type="number" step="0.01" {...register("price")} />
//             {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
//           </div>

//           {/* Event Category */}
//           <div className="mb-4">
//             <Label>Category</Label>
//             <Select onValueChange={(value) => setValue("categoryId", value)}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((category) => (
//                   <SelectItem key={category.id} value={category.id}>
//                     {category.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
//           </div>

//           {/* Event Features */}
//           <div className="mb-4">
//             <Label>Event Highlights</Label>
//             <div className="flex gap-2">
//               <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature" />
//               <Button type="button" onClick={handleAddFeature}>
//                 Add
//               </Button>
//             </div>
//             {features.length > 0 && (
//               <ul className="mt-2 space-y-1">
//                 {features.map((feature, index) => (
//                   <li key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
//                     {feature}
//                     <Button variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)}>
//                       ✕
//                     </Button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//             {errors.features && <p className="text-red-500 text-sm">{errors.features.message as string}</p>}
//           </div>
          
//           {/* Event Description */}
//           <div className="mb-4">
//               <Label>Description</Label>
//               <Textarea {...register("description")} />
//               {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//           </div>

//           {/* Event Image Upload */}
//           <div className="mb-4">
//             <Label>Image</Label>
//             <Input type="file" accept="image/*" {...fileRef} />
//             {errors.image && <p className="text-red-500 text-sm">{errors.image.message as string}</p>}
//           </div>

//           {/* Footer Buttons */}
//           <DialogFooter className="flex justify-between">
//             <Button type="submit" variant={"default"} className="text-white" disabled={loading}>
//               {loading ? "Adding..." : "Create Event"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
