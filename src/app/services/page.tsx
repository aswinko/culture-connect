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
          src="/placeholder.svg?height=800&width=1600&text=Our+Services"
          alt="Our Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl">Discover how EventBid can transform your event planning experience</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How EventBid Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Our innovative bidding platform connects event planners with premium venues through a transparent and
            competitive process.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4 relative">
                <Gavel className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </span>
              </div>
              <h3 className="font-medium text-lg mb-2">Place Your Bid</h3>
              <p className="text-muted-foreground">
                Browse available venues and place a competitive bid that meets your budget.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4 relative">
                <Clock className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </span>
              </div>
              <h3 className="font-medium text-lg mb-2">Win the Auction</h3>
              <p className="text-muted-foreground">
                If your bid is the highest when the auction ends, you secure the venue.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4 relative">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </span>
              </div>
              <h3 className="font-medium text-lg mb-2">Confirm with Deposit</h3>
              <p className="text-muted-foreground">
                Pay a 10% deposit to secure your booking, with the balance due before the event.
              </p>
            </div>
          </div>
        </div>


        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Additional Services</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
            Beyond venue bidding, we offer a range of complementary services to make your event perfect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-muted rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Catering Connections</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                We partner with top-rated catering services across the country. After securing your venue, we can
                connect you with caterers who specialize in your event type and location.
              </p>
              <ul className="space-y-2">
                {[
                  "Customized menu planning",
                  "Dietary accommodation expertise",
                  "Exclusive discounts with partner caterers",
                  "Tasting sessions arrangement",
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
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Entertainment Booking</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Complete your event with the perfect entertainment. We can help you find and book musicians, DJs,
                performers, and more to match your event&apos;s atmosphere.
              </p>
              <ul className="space-y-2">
                {[
                  "Curated entertainment recommendations",
                  "Simplified booking process",
                  "Technical requirements coordination",
                  "Performance previews and portfolios",
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

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {[
              {
                question: "How does the bidding process work?",
                answer:
                  "Our bidding process is simple: browse available venues, place your bid, and monitor the auction. If your bid is the highest when the auction ends, you win the venue. You'll then pay a 10% deposit to secure your booking, with the remaining 90% due closer to the event date.",
              },
              {
                question: "What happens if I win a bid?",
                answer:
                  "When you win a bid, you'll receive a notification immediately. You'll then have 24 hours to pay the 10% deposit to secure your booking. After paying the deposit, you'll receive a confirmation with all the venue details and information about when the remaining balance is due.",
              },
              {
                question: "Is my 10% deposit refundable?",
                answer:
                  "The 10% deposit is generally non-refundable as it secures your venue and takes it off the market for other potential bidders. However, specific cancellation policies may vary by venue, so we recommend reviewing the terms for each specific venue before bidding.",
              },
              {
                question: "Can I visit the venue before bidding?",
                answer:
                  "Yes, many venues offer scheduled viewing times or virtual tours. Check the venue listing for available viewing options. Premium members get access to enhanced virtual tours and can request private viewings through their account manager.",
              },
              {
                question: "What types of events can I book through EventBid?",
                answer:
                  "EventBid supports a wide range of events including corporate functions, weddings, social gatherings, conferences, entertainment events, and more. Our diverse venue selection accommodates everything from intimate gatherings to large-scale productions.",
              },
              {
                question: "How far in advance should I bid on a venue?",
                answer:
                  "We recommend bidding at least 3-6 months in advance for most events, and 6-12 months for weddings or large corporate events. However, we do have last-minute opportunities available if you're planning on a shorter timeline.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="bg-muted rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of event planners who have saved money and found their perfect venue through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/events">Browse Available Venues</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

