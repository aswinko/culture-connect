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


"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Calendar, TrendingUp, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { format, formatDistanceToNow } from "date-fns"
import { Event } from "@/types/Event"

export default function AllEventsClient({events, categories}: {events: Event[]; categories: { id: string; name: string; }[]}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("endingSoon")

  // Filter events based on search query and category
  const filteredEvents = Array.isArray(events) && events.filter((event: Event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || event.category_id === activeCategory
    return matchesSearch && matchesCategory
  })

  
  // Check if filteredEvents is valid before sorting
  const sortedEvents = Array.isArray(filteredEvents) && [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "endingSoon":
        return new Date(a.bidding_ends_at).getTime() - new Date(b.bidding_ends_at).getTime()
      case "priceLowHigh":
        return a.current_bid - b.current_bid
      case "priceHighLow":
        return b.current_bid - a.current_bid
      case "dateAsc":
        return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
      default:
        return 0
    }
  })


  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  }
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Event Bidding</h1>
            <p className="text-muted-foreground">Bid on premium venues and event spaces</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endingSoon">Ending Soon</SelectItem>
                <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
                <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
                <SelectItem value="dateAsc">Event Date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="gap-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              All
            </TabsTrigger>
            {categories.map((category: { name: string; id: string }, index: number) => (
                <TabsTrigger key={index} value={category.name} onClick={() => setActiveCategory(category.id)}>
                  {category.name}
                </TabsTrigger>
            ))}   
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(sortedEvents) && sortedEvents.length > 0 && (sortedEvents.map((event: Event) => (
            <Link key={event.id} href={`/event/${event.id}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-video">
                    <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">Bidding</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-1">{event.name}</h3>
                    <Badge variant="outline">{getCategoryName(event.category_id)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date ? format(event.date, "MMMM d, yyyy") : "Date not available"}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Timer className="h-4 w-4 text-amber-500" />
                    <span className="text-xs">
                      Ends {formatDistanceToNow(event.bidding_ends_at, { addSuffix: true })}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">Current bid:</span>
                      </div>
                      <p className="text-sm font-bold">${event.current_bid.toLocaleString()}</p>
                    </div>
                    <Progress
                      value={Math.min(
                        Math.max(
                          ((event.current_bid - event.starting_price) / (event.ending_price - event.starting_price)) * 100,
                          0,
                        ),
                        100,
                      )}
                      className="h-1.5 mt-1"
                    />
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>Starting: ${event.starting_price.toLocaleString()}</span>
                      <span>Buy now: ${event.ending_price.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>            
        )))}
        </div>

        {Array.isArray(filteredEvents) && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No events found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </>
  )
}

