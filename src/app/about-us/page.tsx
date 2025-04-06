import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Users, Award, Shield, Star } from 'lucide-react'
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
          src="/placeholder.svg?height=800&width=1600&text=About+EventBid" 
          alt="About EventBid"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EventBid</h1>
          <p className="text-xl max-w-3xl">Revolutionizing how events are booked through transparent bidding</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Our Story */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              EventBid was founded in 2020 with a simple mission: to make premium event venues accessible through a transparent bidding process. We noticed that traditional event booking was often opaque, with hidden fees and limited options.
            </p>
            <p className="text-muted-foreground mb-4">
              Our founders, with over 20 years of combined experience in event management and technology, created a platform that connects event organizers directly with venue owners, allowing for fair market pricing through competitive bidding.
            </p>
            <p className="text-muted-foreground">
              Today, EventBid has facilitated over 5,000 successful events across the country, from intimate weddings to large corporate galas, saving our customers an average of 15% compared to traditional booking methods.
            </p>
          </div>
          {/* <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image 
              src="/placeholder.svg?height=800&width=800&text=Our+Story" 
              alt="Our Story"
              fill
              className="object-cover"
            />
          </div> */}
        </div>
        
        {/* Our Mission */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground">
            &quot;To create a transparent marketplace where event hosts can find their perfect venue at a fair price, and venue owners can maximize their bookings through competitive bidding.&quot;
          </p>
          <Separator className="my-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">For Everyone</h3>
              <p className="text-sm text-muted-foreground">
                Making premium venues accessible to all event organizers
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                Curating only the best venues and experiences
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Secure & Trusted</h3>
              <p className="text-sm text-muted-foreground">
                Providing a safe and reliable booking experience
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        {/* <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-Founder",
                bio: "Former event planning executive with 12 years of experience in luxury events.",
                image: "/placeholder.svg?height=400&width=400&text=SJ"
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-Founder",
                bio: "Tech entrepreneur with multiple successful marketplace platforms.",
                image: "/placeholder.svg?height=400&width=400&text=MC"
              },
              {
                name: "Priya Patel",
                role: "COO",
                bio: "Operations expert with background in hospitality management.",
                image: "/placeholder.svg?height=400&width=400&text=PP"
              },
              {
                name: "David Wilson",
                role: "Head of Partnerships",
                bio: "Developed relationships with over 500 premium venues nationwide.",
                image: "/placeholder.svg?height=400&width=400&text=DW"
              }
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image 
                    src={member.image || "/placeholder.svg"} 
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
        
        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "EventBid helped us secure our dream wedding venue at a price we could actually afford. The bidding process was exciting and transparent.",
                author: "Jessica & Mark",
                event: "Wedding at Riverside Estate"
              },
              {
                quote: "As a corporate event planner, I've saved my clients thousands of dollars using EventBid. The quality of venues is outstanding.",
                author: "Robert T.",
                event: "Annual Tech Conference"
              },
              {
                quote: "The 10% deposit system gave us peace of mind that our charity gala venue was secured, while giving us time to fundraise the remaining amount.",
                author: "Children's Hope Foundation",
                event: "Annual Fundraiser Gala"
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
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Venue?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of event planners who have discovered the perfect venue through our bidding platform.
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
