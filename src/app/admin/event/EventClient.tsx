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

export default function EventClient({events, categories}: {events: Event[]; categories: { id: string; name: string; }[]}) {
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
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">premium events and event spaces</p>
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
            // <Link key={event.id} href={`/event/${event.id}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md" key={event.id}>
                  <div className="relative aspect-video">
                    <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-1">{event.name}</h3>
                    <Badge variant="outline">{getCategoryName(event.category_id)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>

                  {/* <div className="flex items-center gap-2 mt-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date ? format(event.date, "MMMM d, yyyy") : "Date not available"}</span>
                  </div> */}

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
            // </Link>            
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

