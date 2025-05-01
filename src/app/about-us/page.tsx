import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Users, MessageCircle, Star, Music2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image 
          src="/banner2.jpg" 
          alt="About Your Platform"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Platform</h1>
          <p className="text-xl max-w-3xl">Simplifying event bookings with flexible payments and easy communication</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">

        {/* Our Story */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            We started with a vision to remove the complexity from event planning. Whether it's a small birthday party or a large cultural fest, our platform connects users with organizers and performers quickly and affordably.
          </p>
          <p className="text-muted-foreground mb-4">
            By allowing users to book events and artists with just a 20% upfront payment — confirmed only after organizer approval — we provide both flexibility and trust. Plus, our in-app messaging makes planning easy and direct.
          </p>
          <p className="text-muted-foreground">
            From booking a venue to hiring singers, guitarists, or entire bands — our platform is the all-in-one solution for a hassle-free event experience.
          </p>
        </div>

        {/* Our Mission */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground">
            &quot;To make event planning simple, transparent, and accessible — for everyone involved, from organizers to artists.&quot;
          </p>
          <Separator className="my-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Simple Booking</h3>
              <p className="text-sm text-muted-foreground">
                Book venues and performers with just 20% upfront, confirmed after approval.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Direct Messaging</h3>
              <p className="text-sm text-muted-foreground">
                Chat with organizers or artists directly through our platform.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Hire Talents</h3>
              <p className="text-sm text-muted-foreground">
                Book singers, guitarists, bands, and other performers for your event.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Booking a live band for my wedding was so easy, and paying only 20% upfront gave us more flexibility.",
                author: "Anjali & Rohit",
                event: "Wedding with Live Music"
              },
              {
                quote: "The chat feature helped us coordinate with the guitarist directly. Great platform!",
                author: "Daniel",
                event: "Birthday Bash"
              },
              {
                quote: "We hosted a college fest and booked multiple artists easily. The status update system was super helpful.",
                author: "TechnoCultural Club",
                event: "Annual Fest 2024"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-muted rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Planning Your Perfect Event</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discover and book venues, artists, and performers with confidence and ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/all-events">
                Browse Events
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">
                Our Services <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
