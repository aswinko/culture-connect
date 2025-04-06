// "use client";

// import { useEffect, useState } from "react";
// import { getAllCategories, getAllEvents } from "@/app/actions/event-actions";
// import { EventCard } from "@/components/layout/EventCard";
// import Navbar from "@/components/layout/Navbar";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Event } from "@/types/Event";

// const AllEvents = () => {
//   // 🌟 State for events and filters
//   const [events, setEvents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
//   const [ , setCategoryLoading] = useState(true);

//   const [priceFilter, setPriceFilter] = useState("");

//   // 🌟 Fetch events when the component mounts
//   useEffect(() => {
//     async function fetchEvents() {
//       const data = await getAllEvents();
//       setEvents(data);
//     }
//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     async function fetchCategories() {
//       setCategoryLoading(true);
//       try {
//         const data = await getAllCategories();
//         setCategories(data);
//       } catch (error) {
//         console.log(error);
        
//         toast.error("Failed to fetch categories.");
//       } finally {
//         setCategoryLoading(false);
//       }
//     }
//     fetchCategories();
//   }, []);

//   // 🌟 Filtered Events
//   const filteredEvents = events.filter((event: Event) => {
//     return (
//       (!searchQuery || event.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       (!selectedCategory || event.category_id === selectedCategory) &&
//       (!priceFilter ||
//         (priceFilter === "low" && event.price < 500) ||
//         (priceFilter === "mid" && event.price >= 5000 && event.price < 20000) ||
//         (priceFilter === "high" && event.price >= 20000))
//     );
//   });

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col min-h-screen">
//         <main className="flex-1">
//           {/* 🌟 Search & Filter Section */}
//           <section className="container mx-auto mt-6 flex flex-wrap gap-4 items-center">
//             {/* Search Bar */}
//             <Input
//               type="text"
//               placeholder="Search events..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full sm:w-1/3"
//             />

//             {/* Category Filter */}
//              <Select onValueChange={setSelectedCategory}>
//                     <SelectTrigger>
//                     <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                     {categories.map((category) => (
//                         <SelectItem key={category.id} value={category.id}>
//                         {category.name}
//                         </SelectItem>
//                     ))}
//                     </SelectContent>
//                 </Select>

//             {/* Price Filter */}
//             <Select onValueChange={setPriceFilter}>
//               <SelectTrigger className="w-full sm:w-1/4">
//                 <SelectValue placeholder="Select Price Range" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="d">All</SelectItem>
//                 <SelectItem value="low">Below ₹500</SelectItem>
//                 <SelectItem value="mid">₹500 - ₹2000</SelectItem>
//                 <SelectItem value="high">Above ₹2000</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Reset Button */}
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setSearchQuery("");
//                 setSelectedCategory("");
//                 setPriceFilter("");
//               }}
//             >
//               Reset
//             </Button>
//           </section>

//           {/* 🌟 Events List */}
//           <section className="container mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredEvents.length > 0 ? (
//               filteredEvents.map((event: Event, index) => (
//                 <Link
//                   href={`/event/${event.id}`}
//                   className="hover:scale-[102%] transition-transform duration-300"
//                   key={index}
//                 >
//                   <EventCard
//                     title={event.name}
//                     description={event.description}
//                     imageUrl={event.image}
//                     price={event.price}
//                   />
//                 </Link>
//               ))
//             ) : (
//               <div className="col-span-full text-center text-gray-500 mt-10">
//                 No events found.
//               </div>
//             )}
//           </section>
//         </main>
//       </div>
//     </>
//   );
// };

// export default AllEvents;


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

