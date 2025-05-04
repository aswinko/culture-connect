import React from "react";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MyBookingsPage from "./MyBookingsClient";
import { getBookingsByCurrentUser } from "@/app/actions/booking-actions";
import { getUserById } from "@/app/actions/auth-actions";

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div>User Not Found</div>;

  const bookings = await getBookingsByCurrentUser(user.id);
  if (!bookings) return <div>No Bookings Found</div>;  
  // console.log(bookings);
  
  return (
    <>
      <Navbar />
      <MyBookingsPage bookings={bookings} />
      <Footer />
    </>
  );
};

export default page;
