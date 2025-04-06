// import LogoutBtn from "@/components/Authentication/LogoutBtn";
// import { EventCard } from "@/components/layout/EventCard";
import { ImageCarousel } from "@/components/layout/Image-Carousel";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getAllCategories, getAllEvents, getAllEventsExceptCurrentUser } from "./actions/event-actions";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Footer from "@/components/layout/Footer";
import EventCarouselItem from "@/components/layout/event-carousel-item";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {

    const supabase = await createClient()
    const { data } = await supabase.auth.getUser();
    const events = data.user ? await getAllEventsExceptCurrentUser(data.user.id) : await getAllEvents();
    const categories = await getAllCategories();

    const getCategoryName = (categoryId: string) => {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.name : "Unknown";
    }

  if (!events) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Event not found
        </h2>
      </div>
    );
  }



  return (
    <>        
    <Navbar />
    <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <section className="w-full bg-green-50 dark:bg-gray-900">
                <div className="">  
                  <ImageCarousel /> 
                </div>
          </section>

          {/* Upcoming Concerts Carousel */}
          <section className="container mx-auto w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <Badge className="px-3 py-1 text-sm" variant="secondary">
                    Hot Tickets
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Upcoming Concerts</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Dont miss these incredible live performances coming to venues near you.
                  </p>
                </div>
              </div>

              <div className="mx-auto max-w-5xl py-12">
                <Carousel opts={{ align: "start" }}>
                  <CarouselContent className="-ml-4">
                    {events.map((event: { id: string; name: string; description: string; image: string; price: number, category_id: string; }, index: number) => (
                          <CarouselItem className="basis-1/1 md:basis-1/2 lg:basis-1/4" key={index}>

                      <Link href={`/event/${event.id}`} className="hover:scale-[102%] transition-transform duration-300">

                        <EventCarouselItem name={event.name} description={event.description.length > 100 ? event.description.slice(0, event.description.slice(0, 150).lastIndexOf(" ")) + "...": event.description} image={event.image} price={event.price} category={getCategoryName(event.category_id)} />
                      </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-end gap-2 mt-4">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
                </Carousel>
              </div>

              <div className="flex justify-center">
                <Link href={"/all-events"}>
                  <Button variant="outline" className="gap-1">
                    View All Concerts <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Music Genres Section */}
        <section className="container mx-auto w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Browse by Genre</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find concerts and performances that match your musical taste.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category: {name: string;}, i: number) => (
                <Card
                  key={i}
                  className="flex flex-col items-center justify-center p-6 text-center hover:bg-accent transition-colors cursor-pointer"
                >
                  {/* <div className="mb-2 rounded-full bg-primary/10 p-3">
                    <genre.icon className="h-6 w-6 text-primary" />
                  </div> */}
                  <h3 className="font-medium">{category.name}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fan Testimonials Section */}
        <section className="container mx-auto w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Music Fans Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from fans who have booked concert tickets through our platform.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-5xl py-12">
              <Carousel opts={{ loop: true }}>
                <CarouselContent className="-ml-4">
                  {[
                    {
                      quote:
                        "BeatBooker made it so easy to get front-row tickets to my favorite rapper's show! The whole process was smooth and the mobile tickets worked perfectly.",
                      name: "Marcus Johnson",
                      role: "Hip-Hop Fan",
                    },
                    {
                      quote:
                        "I was able to score VIP passes to the summer festival through this site when they were sold out everywhere else. The backstage experience was worth every penny!",
                      name: "Alicia Chen",
                      role: "Festival Goer",
                    },
                    {
                      quote:
                        "I use BeatBooker for all my concert tickets now. The price alerts helped me get great seats at a reasonable price for a show I thought would be out of my budget.",
                      name: "Jason Rodriguez",
                      role: "Rock Enthusiast",
                    },
                    {
                      quote:
                        "The venue information and seating chart were super helpful in choosing the perfect seats. I could see exactly what my view of the stage would be before buying.",
                      name: "Sophia Kim",
                      role: "Pop Concert Fan",
                    },
                    {
                      quote:
                        "I love how I can follow my favorite artists and get notified as soon as they announce new tour dates in my city. Never miss a show now!",
                      name: "Tyler Thompson",
                      role: "Electronic Music Fan",
                    },
                  ].map((testimonial, i) => (
                    <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="p-6 h-full">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <p className="mt-4 flex-grow text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                          <div className="mt-4 pt-4 border-t">
                            <p className="font-medium">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="container mx-auto w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Never miss your favorite artists
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up for alerts about new concert announcements, presale tickets, and exclusive offers.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2 sm:flex-row">
                <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </section>

        {/* <section className="container mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {events.map((event: { id: string; name: string; description: string; image: string; price: number }, index: number) => (
            <Link href={`/event/${event.id}`} className="hover:scale-[102%] transition-transform duration-300" key={index}>
              <EventCard title={event.name} description={event.description} imageUrl={event.image} price={event.price} />
            </Link>
          ))}
        </section> */}
      </main>
    </div>
    <Footer />
    </>
  );
}
