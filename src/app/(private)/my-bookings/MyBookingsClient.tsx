"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Booking, BookingStatus } from "@/types/Booking";
import { ReviewForm } from "@/components/layout/ReviewForm";
import SignAgreement from "@/components/layout/SignAgreement";
import BookingChatPage from "@/components/layout/BookingChat";

export default function MyBookingsPage({ bookings }: { bookings: Booking[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);

  const toastId = useId();

  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const handlePayment = async (booking: Booking) => {
    setIsLoading(true);
    toast.loading("Initializing payment...", { id: toastId });
    try {
      const advanceAmount = Math.round(
        (booking.negotiated_amount || booking.events.price) * 0.2
      );

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: advanceAmount,
          bookingId: booking.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create Razorpay order");

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "CultureConnect",
        description: "Program Booking Payment",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const res = await fetch("/api/payment/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
              eventId: booking.event_id,
              userId: booking.user_id,
              advance_amount: advanceAmount,
            }),
          });

          const result = await res.json();
          if (result?.success) {
            toast.success("Payment successful!", { id: toastId });
            window.location.reload();
          } else {
            toast.error("Payment verification failed.", { id: toastId });
          }
        },
        prefill: {
          name: "Your Name",
          email: "your@email.com",
          contact: "9876543210",
        },
        theme: { color: "#3399cc" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).Razorpay) {
        toast.error("Razorpay SDK not loaded. Please refresh.", { id: toastId });
        setIsLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(`Payment failed. Try again. ${error}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Link href="/">
            <Button variant="outline">Book New Event</Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
            <p className="text-muted-foreground mb-4">
              You haven’t made any event bookings yet.
            </p>
            <Link href="/">
              <Button>Book Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              return (
                <Card key={booking.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-4xl">
                          {booking.events.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {booking.date}
                        </CardDescription>
                      </div>
                      {renderStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {booking.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Booking Date</div>
                        <div>{new Date(booking.created_at).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="font-medium">
                          ₹{booking.events.price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Booking ID</div>
                        <div className="font-mono text-sm">{booking.id}</div>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-4">
                    {booking.status === "confirmed" ? (
                      <div className="space-y-4 w-full">
                        <div className="border p-4 rounded-md bg-muted/40">
                          <p className="text-sm mb-2">
                            Please read and sign the agreement before proceeding to payment.
                          </p>
                          <div className="flex flex-col md:flex-row items-center justify-between">
                            <SignAgreement user="aswin" organizer="adhi" />
                            <label className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={agreementSigned}
                                onChange={(e) => setAgreementSigned(e.target.checked)}
                              />
                              <span>I have signed the agreement</span>
                            </label>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handlePayment(booking)}
                          disabled={isLoading || !agreementSigned}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay ₹
                          {Math.round(
                            (booking.negotiated_amount || booking.events.price) * 0.2
                          )}{" "}
                          Now
                        </Button>
                      </div>
                    ) : booking.status === "paid" ? (
                      <div className="w-full space-y-4">
                        <div className="text-center text-sm text-green-700">
                          You have successfully paid
                        </div>
                        <ReviewForm
                          bookingId={booking.id}
                          userId={booking.user_id ?? ""}
                        />
                        <BookingChatPage
                          name={"Organizer"}
                          bookingId={booking.id}
                          userId={booking.user_id ?? ""}
                          organizerId={booking.events.user_id}
                        />                      
                      </div>
                    ) : (
                      <div className="w-full text-center text-sm text-muted-foreground">
                        {booking.status === "pending"
                          ? "Waiting for organizer approval"
                          : "This booking was rejected by the organizer"}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
