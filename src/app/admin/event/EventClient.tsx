"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/Event";

export default function EventClient({
  events,
  categories,
}: {
  events: Event[];
  categories: { id: string; name: string }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("endingSoon");

  // Filter events based on search query and category
  const filteredEvents =
    Array.isArray(events) &&
    events.filter((event: Event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || event.category_id === activeCategory;
      return matchesSearch && matchesCategory;
    });

  // Check if filteredEvents is valid before sorting
  const sortedEvents =
    Array.isArray(filteredEvents) &&
    [...filteredEvents].sort((a, b) => {
      switch (sortBy) {
        case "priceLowHigh":
          return a.price - b.price;
        case "priceHighLow":
          return b.price - a.price;
        case "dateAsc":
          return (
            new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
          );
        default:
          return 0;
      }
    });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">
              premium events and event spaces
            </p>
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
            {categories.map(
              (category: { name: string; id: string }, index: number) => (
                <TabsTrigger
                  key={index}
                  value={category.name}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </TabsTrigger>
              )
            )}
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(sortedEvents) &&
            sortedEvents.length > 0 &&
            sortedEvents.map((event: Event) => (
              <Card
                className="h-full overflow-hidden transition-all hover:shadow-md"
                key={event.id}
              >
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
                    <Badge variant="outline">
                      {getCategoryName(event.category_id)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold">
                        V{event.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {Array.isArray(filteredEvents) && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No events found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </>
  );
}
