// import Image from "next/image";
// import Link from "next/link";
// import { ChevronLeft, Info, Share } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { getCategoryById, getEventById, getRelatedEvent } from "@/app/actions/event-actions";
// import { EventCard } from "@/components/layout/EventCard";
// import { Event } from "@/types/Event";
// import Navbar from "@/components/layout/Navbar";

import { getEventById } from "@/app/actions/event-actions";
import EventDetail from "./EventDetail";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBids } from "@/app/actions/bid-actions";

// interface Params {
//   params: Promise<{
//     id: string;
//   }>;
// }


// export default async function EventDetailPage({ params }: Params) {

//   const id = (await params).id;

//   if (!id){
//       return <div>Not found</div>
//   }
//   const event = await getEventById(id);

//   const relatedEvents = await getRelatedEvent(id)
  
//   //   console.log(product);
//   let category = null
//   if (event) {
//   // 🔹 Fetch category name separately
//   category = await getCategoryById(event.category_id);
//   } else {
//   // Handle the case where product is null
//   category = null; // or handle accordingly
//   }

//   const depositAmount = (event ? (event.price *  0.1) : 0).toFixed(2)
//   const totalAmount = (event ? (event.price) : 0).toFixed(2)

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         {/* Breadcrumb */}
//         <div className="mb-6">
//           <Link
//             href="/all-events"
//             className="flex items-center text-sm text-muted-foreground hover:text-primary"
//           >
//             <ChevronLeft className="h-4 w-4 mr-1" />
//             Back to Events
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//           {/* Event Image */}
//           <div className="space-y-4">
//             <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
//               {event ? (
//                 <Image
//                 src={event.image || ""}
//                 alt={event.name}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//               ):(
//                 <div>No image</div>
//               )}
              
//             </div>
//           </div>

//           {/* Event Info */}
//           <div className="flex flex-col space-y-6">
//             <div>
//               <Badge className="mb-2">{category ? category.name : "N/A"}</Badge>
//               <h1 className="text-3xl font-bold">{event ? event.name : "Event not found"}</h1>
//               {/* <div className="flex items-center mt-2 space-x-2">
//                 <div className="flex">
//                   {[...Array(5)]?.map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < Math.floor(event.rating)
//                           ? "text-yellow-400 fill-yellow-400"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   {event.rating} ({event.reviewCount} reviews)
//                 </span>
//               </div> */}
//               <div className="text-2xl font-bold">
//                 {event ? `₹${event.price.toFixed(2)}` : "Price not available"}
//               </div>
//               <p className="text-muted-foreground">{event?.location || "No location"}</p>
//             </div>
//             <div className="bg-muted p-4 rounded-lg">
//               <div className="flex justify-between mb-2">
//                 <span>Deposit (10%)</span>
//                 <span className="font-medium">₹{depositAmount}</span>
//               </div>
//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <span>Total due later</span>
//                 <span>₹{( Number.parseFloat(totalAmount) - Number.parseFloat(depositAmount)).toFixed(2)}</span>
//               </div>
//               <Separator className="my-2" />
//               <div className="flex justify-between font-bold">
//                 <span>Total price</span>
//                 <span>₹{totalAmount}</span>
//               </div>
//               <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
//                 <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
//                 <p>Only 10% deposit required now. Remaining balance due 7 days before the event.</p>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <Link href={`/event/checkout?eventId=${event?.id}`}>
//                 <Button className="flex-1" size="lg">
//                   Book Now
//                 </Button>
//               </Link>
//               <Button variant="outline" size="icon" className="rounded-full">
//                 <Share className="h-5 w-5" />
//                 <span className="sr-only">Share event</span>
//               </Button>
//             </div>

//             <Separator />

//             <Separator />

//             <Tabs defaultValue="description" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="description">Description</TabsTrigger>
//                 <TabsTrigger value="features">Event Highlights</TabsTrigger>
//               </TabsList>
//               <TabsContent value="description" className="pt-4">
//                 <p className="text-muted-foreground">{event?.description || 'No description available'}</p>
//               </TabsContent>
//               <TabsContent value="features" className="pt-4">
//                 <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
//                   {event?.features.map((feature, index) => (
//                     <li key={index}>{feature}</li>
//                   ))}
//                 </ul>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>

//         {/* Related Events */}
//           <div className="mt-16">
//             <h2 className="text-2xl font-bold mb-6">You might also like</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {relatedEvents.relatedEvents?.map((item: Event, index: number) => (
//                 <Link
//                 href={`/event/${item.id}`}
//                 className="hover:scale-[102%] transition-transform duration-300"
//                 key={index}
//               >
//                   <EventCard
//                     title={item.name}
//                     description={item.description}
//                     imageUrl={item.image}
//                     price={item.price}
//                   />
//               </Link>
//               ))}
//             </div>
//           </div>
//       </div>
//     </>
//   );
// }


// Mock event data - in a real app, you would fetch this from an API

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
