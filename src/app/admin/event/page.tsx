import { getAllCategories, getAllEvents } from "@/app/actions/event-actions";
import EventClient from "./EventClient";

export default async function EventsPage() {

  const event = await getAllEvents();

  const categories = await getAllCategories();


  if (!event) return <div>Event Not Found</div>;
  if (!categories) return <div>Category Not Found</div>;
  

  return (
    <>
      <EventClient events={event} categories={categories} />
    </>
  )
}

