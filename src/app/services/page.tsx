import Image from "next/image"
import Link from "next/link"
import { Check, Gavel, Calendar, Clock, Utensils, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src="/banner2.jpg"
          alt="Culture Connect Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Planning, Simplified</h1>
          <p className="text-xl max-w-3xl">Experience seamless venue bidding and personalized event services, all in one place.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* How It Works */}
        {/* How It Works */}
<div className="text-center mb-16">
  <h2 className="text-3xl font-bold mb-4">How Culture Connect Works</h2>
  <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
    Book unforgettable events by connecting directly with verified organizers and talented performers. 
    Pay only when your booking is approved.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4 relative">
        <Calendar className="h-8 w-8 text-primary" />
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          1
        </span>
      </div>
      <h3 className="font-medium text-lg mb-2">Request Booking</h3>
      <p className="text-muted-foreground">
        Browse event packages or performers and send a booking request to the organizer.
      </p>
    </div>
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4 relative">
        <Clock className="h-8 w-8 text-primary" />
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          2
        </span>
      </div>
      <h3 className="font-medium text-lg mb-2">Organizer Confirms</h3>
      <p className="text-muted-foreground">
        The organizer updates the status after confirming availability and details.
      </p>
    </div>
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4 relative">
        <Check className="h-8 w-8 text-primary" />
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          3
        </span>
      </div>
      <h3 className="font-medium text-lg mb-2">Pay 20% to Book</h3>
      <p className="text-muted-foreground">
        Secure your booking by paying just 20% of the event cost. Pay the rest before the event.
      </p>
    </div>
  </div>
</div>

{/* Talent Booking */}
<div className="mb-16">
  <h2 className="text-3xl font-bold mb-4 text-center">Book Talented Performers</h2>
  <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
    Make your event extraordinary by adding live entertainment. Browse and hire top-rated performers.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    <div className="bg-muted rounded-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="rounded-full bg-primary/10 p-3">
          <Music className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Singer & Musicians</h3>
      </div>
      <p className="text-muted-foreground mb-6">
        Choose from a curated list of singers, guitarists, bands, and other artists to suit your event vibe.
      </p>
      <ul className="space-y-2">
        {[
          "Verified artist profiles",
          "Instant availability check",
          "Customizable performance slots",
          "Ratings & reviews from past events",
        ].map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="bg-muted rounded-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="rounded-full bg-primary/10 p-3">
          <Utensils className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Add-on Event Services</h3>
      </div>
      <p className="text-muted-foreground mb-6">
        Need more support? We can help with decorations, stage setup, lighting, and catering coordination.
      </p>
      <ul className="space-y-2">
        {[
          "Custom decoration themes",
          "Stage and lighting arrangements",
          "Vendor coordination",
          "Affordable bundled services",
        ].map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

{/* Reviews & Messaging */}
<div className="mb-16">
  <h2 className="text-3xl font-bold mb-10 text-center">More Features</h2>
  <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto text-muted-foreground text-lg">
    <div>
      <h3 className="text-xl font-semibold mb-2">Chat with Organizers</h3>
      <p>
        Use our secure in-app messaging system to coordinate with organizers, clarify details, and get real-time updates.
      </p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">Read and Leave Reviews</h3>
      <p>
        Check ratings and reviews before booking. After your event, share your experience to help others.
      </p>
    </div>
  </div>
</div>


        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I book a venue or service?",
                answer:
                  "Simply sign up, browse available venues or services, check availability, and make your booking directly from the platform."
              },
              {
                question: "Is it free to create an account?",
                answer:
                  "Yes! Signing up is completely free. You only pay when you confirm a booking."
              },
              {
                question: "Can I cancel a booking?",
                answer:
                  "Cancellation policies vary by venue or service provider. Be sure to review the cancellation terms listed on the booking page."
              },
              {
                question: "Can I visit the venue before booking?",
                answer:
                  "Absolutely! Many venues offer virtual tours or in-person visits. Check the venue profile for available options."
              },
              {
                question: "What kinds of events can I book for?",
                answer:
                  "You can book for weddings, corporate events, private parties, concerts, and more—whatever your occasion, we’ve got you covered."
              },
              {
                question: "How far in advance should I book?",
                answer:
                  "We recommend booking at least 3–6 months ahead for the best availability, but last-minute options are also available."
              }
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>


        {/* Call to Action */}
        <div className="bg-muted rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Let’s Plan Something Great</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of event organizers saving time and money with Culture Connect. Start planning smarter today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/events">Browse Venues</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
