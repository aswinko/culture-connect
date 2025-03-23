"use client"

import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ✅ **Zod Schema for Validation**
const eventSchema = z.object({
    eventName: z.string().min(3, "Event name must be at least 3 characters"),
    eventDescription: z.string().min(10, "Description must be at least 10 characters"),
    eventCategory: z.string().min(1, "Please select an event category"),
    eventPrice: z.preprocess((val) => Number(val), z.number().positive("Price must be a positive number")),
    eventImage: z.any().refine((file) => file?.length === 1, "Please upload an image"),
    eventVideo: z.any().optional(),
  });

const EventForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(eventSchema),
      });

      const toastId = useId();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: z.infer<typeof eventSchema>) => {
    toast.loading("Creating...", { id: toastId });
    setLoading(true);

    console.log("Event Data:", data);
    toast.success("Event created successfully!", {
        id: toastId,
      });
      setLoading(false);
};
  return (
    <>
    {/* Create New Event Form */}
    <Card className="p-6 shadow-lg bg-white dark:bg-gray-900 transition-all">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">Create New Event</CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Event Name */}
        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" placeholder="Enter event name" {...register("eventName")} />
          {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName.message}</p>}
        </div>

        {/* Event Description */}
        <div>
          <Label htmlFor="eventDescription">Description</Label>
          <Textarea id="eventDescription" placeholder="Enter a brief description" {...register("eventDescription")} />
          {errors.eventDescription && <p className="text-red-500 text-sm">{errors.eventDescription.message}</p>}
        </div>

        {/* Event Category Selection */}
        <div>
          <Label htmlFor="eventCategory">Event Category</Label>
          <Select onValueChange={(val) => setValue("eventCategory", val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="music">Music Concert</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="theater">Theater & Drama</SelectItem>
              <SelectItem value="tech">Tech Conference</SelectItem>
              <SelectItem value="comedy">Comedy Show</SelectItem>
            </SelectContent>
          </Select>
          {errors.eventCategory && <p className="text-red-500 text-sm">{errors.eventCategory.message}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="eventImage">Upload Event Image</Label>
          <Input id="eventImage" type="file" accept="image/*" {...register("eventImage")} />
          {errors.eventImage && <p className="text-red-500 text-sm">{errors.eventImage.message?.toString()}</p>}
        </div>

        {/* Video Upload */}
        <div>
          <Label htmlFor="eventVideo">Upload Event Video (Optional)</Label>
          <Input id="eventVideo" type="file" accept="video/*" {...register("eventVideo")} />
        </div>

        {/* Event Price */}
        <div>
          <Label htmlFor="eventPrice">Price (₹)</Label>
          <Input id="eventPrice" type="number" placeholder="Enter price" {...register("eventPrice")} />
          {errors.eventPrice && <p className="text-red-500 text-sm">{errors.eventPrice.message}</p>}
        </div>

        {/* Submit Button */}
        <Button disabled={loading} type="submit" className="w-full dark:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition">
          {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
          Create Event
        </Button>
      </form>
    </CardContent>
  </Card>
  </>
  )
}

export default EventForm
