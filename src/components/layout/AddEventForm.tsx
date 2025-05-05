"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { Event } from "@/types/Event";
import { createClient } from "@/utils/supabase/client";
import { getAllCategories, updateEventDetails, uploadEventImage } from "@/app/actions/event-actions";

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
  description: z.string().min(15, "Description must be at least 15 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  features: z
    .array(z.string().min(2, "Each feature must have at least 2 characters."))
    .min(1, "At least one feature is required."),
  quantity: z
    .string()
    .regex(/^\d+$/, "Quantity must be a valid number")
    .transform((val) => parseInt(val, 10)),
  image: z.any().optional(),
});

interface EventFormProps {
  onProductAdded?: () => void;
  onSubmitComplete?: () => void;
  defaultValues?: Partial<Event>;
}


export default function AddEventForm({
  onProductAdded,
  onSubmitComplete,
  defaultValues,
}: EventFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  console.log("de", defaultValues);
  

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      price: defaultValues?.price?.toString() || "",
      description: defaultValues?.description || "",
      categoryId: defaultValues?.category_id || "",
      features: defaultValues?.features || [],
    },
  });

  useEffect(() => {
    setFeatures(defaultValues?.features || []);
    setValue("features", defaultValues?.features || []);
  }, [defaultValues]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch categories.");
      }
    }
    fetchCategories();
  }, []);

  const handleAddFeature = () => {
    if (featureInput.trim().length > 1) {
      const updatedFeatures = [...features, featureInput.trim()];
      setFeatures(updatedFeatures);
      setValue("features", updatedFeatures);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    setValue("features", updatedFeatures);
  };

  async function onSubmit(data: z.infer<typeof productSchema>) {
    setLoading(true);

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      toast.error("User not authenticated!");
      setLoading(false);
      return;
    }

    let imageUrl = defaultValues?.image || null;
    const file = data.image?.[0];

    if (file && file instanceof File) {
      const { success, error, imageUrl: uploadedImageUrl } =
        await uploadEventImage(file);
      if (!success) {
        toast.error(error || "Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = uploadedImageUrl || null;
    }
      
      const { success, error } = await updateEventDetails({
        id: defaultValues?.id || "",
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        category_id: data.categoryId,
        features,
        image: imageUrl || defaultValues?.image,
      });   
    
      if (!success && error) {
        toast.error(error || "Failed to update event details");
      } else {
        toast.success("Event updated successfully!");
        onSubmitComplete?.();
      }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="border p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {"Edit Product"}
      </h2>

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

        <div className="mb-4">
          <Label>Description</Label>
          <Textarea {...register("description")} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label>Category</Label>
          <Select
            defaultValue={defaultValues?.category_id}
            onValueChange={(value) => setValue("categoryId", value)}
          >
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
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label>Highlights</Label>
          <div className="flex gap-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature"
            />
            <Button type="button" onClick={handleAddFeature}>
              Add
            </Button>
          </div>
          {features.length > 0 && (
            <ul className="mt-2 space-y-1">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm text-gray-700"
                >
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {errors.features && (
            <p className="text-red-500 text-sm">
              {errors.features.message as string}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Label>Quantity</Label>
          <Input type="number" min="0" {...register("quantity")} />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label>Image</Label>
          {defaultValues?.image && (
            <div className="mb-2">
              <Image
                width={100}
                height={100}
                src={defaultValues.image}
                alt="Current Product"
                className="rounded-md w-full h-auto max-h-40 object-contain border"
              />
            </div>
          )}
          <Input type="file" accept="image/*" {...register("image")} />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message as string}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
