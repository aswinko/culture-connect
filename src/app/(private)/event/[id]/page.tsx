import { getEventById, getRelatedEvent } from "@/app/actions/event-actions";
import EventDetail from "./EventDetail";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getUserById } from "@/app/actions/auth-actions";
interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: Params) {
  const id = (await params).id;
  if (!id) {
    return <div>Not found</div>;
  }
  const event = await getEventById(id);
  const relatedEvents = await getRelatedEvent(id)

  const user = await getUserById(event?.user_id ?? "")

  // const relatedEvents = await getRelatedEvent(id)
  if (!event) {
    return <div>No events</div>;
  }

  return (
    <>
      <Navbar />
      <EventDetail event={event} relatedEvents={relatedEvents} user={user} />
      <Footer />
    </>
  );
}
