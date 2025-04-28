"use client";

import type React from "react";

import { Label } from "@/components/ui/label";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  X,
  User,
  Search,
  Filter,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrentUser } from "@/app/actions/auth-actions";
import {
  getEventBookingsForOrganizer,
  updateBookingStatus,
} from "@/app/actions/booking-actions";
import { Booking, BookingStatus } from "@/types/Booking";
import { toast } from "sonner";

// Types for our booking data

export default function OrganizerDashboardPage() {
  const toastId = useId();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>("pending");
  const [statusNote, setStatusNote] = useState("");

  // Simulate fetching bookings from an API
  useEffect(() => {
    const fetchBookings = async () => {
      const user = await getCurrentUser();
      console.log(user?.user_id);

      // Mock data
      const data = await getEventBookingsForOrganizer(user?.user_id as string);
      console.log(data);

      setBookings(data);
      setFilteredBookings(data);
      setLoading(false);
    };

    // Simulate network delay
    setTimeout(fetchBookings, 1000);
  }, []);

  // Filter bookings based on search query and status filter
  useEffect(() => {
    let result = bookings;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.user_profiles?.full_name.toLowerCase().includes(query) ||
          booking.user_profiles?.email.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query) ||
          booking.events.name.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(result);
  }, [searchQuery, statusFilter, bookings]);

  // Helper function to render status badge
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
            <X className="h-3 w-3 mr-1" />
            Rejected
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

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    setLoading(true);

    // Optimistic UI update
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedBooking.id
        ? { ...booking, status: newStatus }
        : booking
    );
    setBookings(updatedBookings);

    try {
      await updateBookingStatus(selectedBooking.id, newStatus);
      toast.success("Booking status updated successfully.", { id: toastId });
    } catch (err) {
      toast.error("Failed to update booking status.", { id: toastId });
      console.error(err);
    } finally {
      setLoading(false);
      setIsUpdateDialogOpen(false);
      setSelectedBooking(null);
      setStatusNote("");
    }
  };

  // Open update dialog for a booking
  const openUpdateDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsUpdateDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Loading bookings...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the booking information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage event bookings and update their status
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline">View Public Site</Button>
            </Link>
            <Button>Create New Event</Button>
          </div> */}
        </div>

        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or booking ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as BookingStatus | "all")
                }
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Accepted</SelectItem>
                  <SelectItem value="cancelled">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({bookings.filter((b) => b.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Accepted (
              {bookings.filter((b) => b.status === "confirmed").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Rejected (
              {bookings.filter((b) => b.status === "cancelled").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  No bookings found
                </h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdateStatus={() => openUpdateDialog(booking)}
                    renderStatusBadge={renderStatusBadge}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {filteredBookings.filter((b) => b.status === "pending").length ===
            0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  No pending bookings
                </h2>
                <p className="text-muted-foreground">
                  All bookings have been processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings
                  .filter((b) => b.status === "pending")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onUpdateStatus={() => openUpdateDialog(booking)}
                      renderStatusBadge={renderStatusBadge}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="mt-6">
            {filteredBookings.filter((b) => b.status === "confirmed").length ===
            0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  No accepted bookings
                </h2>
                <p className="text-muted-foreground">
                  No bookings have been accepted yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings
                  .filter((b) => b.status === "confirmed")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onUpdateStatus={() => openUpdateDialog(booking)}
                      renderStatusBadge={renderStatusBadge}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {filteredBookings.filter((b) => b.status === "cancelled").length ===
            0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  No rejected bookings
                </h2>
                <p className="text-muted-foreground">
                  No bookings have been rejected.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings
                  .filter((b) => b.status === "cancelled")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onUpdateStatus={() => openUpdateDialog(booking)}
                      renderStatusBadge={renderStatusBadge}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status for booking {selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Customer</div>
                  <div className="font-medium">
                    {selectedBooking.user_profiles?.full_name}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Event</div>
                  <div className="font-medium">
                    {selectedBooking.events.name}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Date</div>
                  <div>{selectedBooking.date}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Location</div>
                  <div>{selectedBooking.location}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value) =>
                    setNewStatus(value as BookingStatus)
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Accept</SelectItem>
                    <SelectItem value="cancelled">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Booking Card Component
function BookingCard({
  booking,
  onUpdateStatus,
  renderStatusBadge,
}: {
  booking: Booking;
  onUpdateStatus: () => void;
  renderStatusBadge: (status: BookingStatus) => React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-3xl">
              {booking.events.name}
              {renderStatusBadge(booking.status)}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {booking.date}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onUpdateStatus}>
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Contact Customer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Customer</div>
            <div className="flex items-center font-medium">
              <User className="h-3 w-3 mr-1" />
              {booking.user_profiles?.full_name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {booking.user_profiles?.email}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Location</div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
              {booking.location}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Price</div>
            <div className="font-medium">
              ${booking.negotiated_amount.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Booking ID</div>
            <div className="font-mono text-xs">{booking.id}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(booking.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onUpdateStatus}
        >
          Update Status
        </Button>
      </CardFooter>
    </Card>
  );
}
