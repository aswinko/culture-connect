import { getAllCategories, getAllEvents, getAllEventsExceptCurrentUser } from "@/app/actions/event-actions";
import AllEventsClient from "./AllEventsClient"
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function EventsPage() {

  const supabase = await createClient()

  const {data: { user }} = await supabase.auth.getUser();  

  const event = user ? await getAllEventsExceptCurrentUser(user.id) : await getAllEvents();

  const categories = await getAllCategories();


  if (!event) return <div>Event Not Found</div>;
  if (!categories) return <div>Category Not Found</div>;
  

  return (
    <>
      <Navbar />
      <AllEventsClient events={event} categories={categories} />
      <Footer />
    </>
  )
}

