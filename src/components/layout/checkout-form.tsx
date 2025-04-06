"use client";

import type React from "react";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/app/actions/booking-actions";
import { toast } from "sonner";

export function CheckoutForm({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const toastId = useId();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    date: "",
    negotiatedAmount: "0",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Booking in progress...", { id: toastId });
    setLoading(true);
    try {
      await createBooking({
        ...formData,
        eventId: eventId,
        userId: userId,
        negotiatedAmount: parseFloat(formData.negotiatedAmount),
      });
      toast.success("Booking successful!", { id: toastId });
      setLoading(false);
      router.push("/my-bookings");
    } catch (err) {
      setLoading(false);
      console.error("Booking error:", err);
      toast.error("Failed to save booking. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book Your Event</CardTitle>
        <CardDescription>
          Enter your details to reserve your spot
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter the address"
              required
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter the location"
              required
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              placeholder="Enter the date"
              required
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2 mb-4">
            <Label htmlFor="negotiatedAmount">
              <div className="flex items-center">Negotiated Amount</div>
            </Label>
            <Input
              id="negotiatedAmount"
              placeholder="Enter negotiable Amount"
              value={formData.negotiatedAmount}
              onChange={(e) => handleChange("negotiatedAmount", e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Proceed"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
