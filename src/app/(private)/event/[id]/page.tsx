
import { getEventById } from "@/app/actions/event-actions";
import EventDetail from "./EventDetail";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBids } from "@/app/actions/bid-actions";
interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: Params) {

    const id = (await params).id;
    const supabase = await createClient()

    const {data: { user }} = await supabase.auth.getUser();        

  if (!id){
      return <div>Not found</div>
  }
  const event = await getEventById(id);

  // const relatedEvents = await getRelatedEvent(id)
  if (!event) {
    return <div>No events</div>
  }

  const bids = await getBids(event.id as string)
  if (!bids) {
    return <div>No bids</div>
  }

  console.log(bids);
  

  return (
    <>
      <Navbar />
      <EventDetail event={event} userId={user ? user.id : ''} bids={bids.bids || []} />
      <Footer />
    </>
  )}
