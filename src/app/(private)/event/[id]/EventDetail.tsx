"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Event } from "@/types/Event"
import { User } from "@/types/User"

const EventDetail = ({ event, relatedEvents, user }: { event: Event; user: User[] | null; relatedEvents: {relatedEvents: Event[]}}) => {
    // const toastId = useId()
    
    const router = useRouter()
  
    if (!event) {
      return (
        <>
          {/* <Header /> */}
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">Event not found</h1>
            <Button variant="link" onClick={() => router.push("/events")}>
              View all events
            </Button>
          </div>
        </>
      )
    }
  
    function handleCheckout(eventId: string) {
      router.push(`/checkout/${eventId}`)
    }
      
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/all-events" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Event Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
              <Image
                src={event?.image || "/placeholder.svg"}
                alt={event?.name}
                fill
                className="object-cover"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-primary/80 hover:bg-primary">Event Live</Badge>
            </div>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Total Price</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal Price</span>
                    <span>₹{event?.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST</span>
                    <span>₹{event?.gst?.toLocaleString() || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Price</span>
                    <span className="text-primary">₹{event?.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">

                  </div>
                </div>
                <div className="space-y-2">
                  {
                    user? (
                      <Button variant="default" className="w-full" onClick={()=> handleCheckout(event?.id || '')}>
                        Proceed to Checkout
                      </Button> 
                    ) : (
                      <Link href={"/login"} className="w-full bg-black rounded-sm px-4 py-2 text-white">
                        You need to sign in first, <span className="text-red-500">Click here</span>
                      </Link> 
                    )
                  }

                </div>

                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Upon booking an event, a 20% deposit is required. The organizer will then review the booking request and may 
                      choose to accept or decline it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Event Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event?.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>Premium Event</span>
              </div>
              <p className="text-lg">{event?.description}</p>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4 space-y-4">
                <h4 className="font-medium mt-4 mb-2">Event Features:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {event?.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </TabsContent>    
              <TabsContent value="agenda" className="pt-4">
                <h4 className="font-medium mt-4 mb-2">Event Agendas:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {event?.agendas?.map((agenda, index) => (
                    <li key={index}>{agenda}</li>
                ))}
                </ul>
              </TabsContent>
            </Tabs>

            <div>
              <h3 className="text-xl font-bold mb-4">About the Organizer</h3>
              <Card>
                <CardContent className="pt-1">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?text=₹{event?.organizer?.charAt(0)}`} />
                      <AvatarFallback>{user?.[0]?.full_name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.[0]?.full_name || 'Unknown User'}</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        {user?.[0]?.bio || 'No bio available'}
                      </p>
                      {/* <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          Contact
                        </Button>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Previous Works</h3>
              <video controls className="w-full rounded-lg">
                <source src={event?.video} />
                Your browser does not support the video tag.
              </video>            
            </div>
          </div>

          {/* Bidding Rules */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">How Booking Works</h4>
                  <p className="text-sm text-muted-foreground">
                    Submit a booking request for the event. A 20% deposit is required at the time of booking. 
                    The event organizer will review the request and may approve or decline it.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Deposit Requirement</h4>
                  <p className="text-sm text-muted-foreground">
                    A 20% refundable deposit must be paid during the booking process. 
                    This deposit secures your booking request pending organizer approval.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Approval Process</h4>
                  <p className="text-sm text-muted-foreground">
                    Once a booking request is submitted with the deposit, the event organizer will review it and decide whether to accept or decline the request.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Cancellation Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    In case of cancellation by the requester, the 20% deposit remains refundable. 
                    Additional refunds, if any, are subject to the organizer&apos;s discretion.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Events */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.relatedEvents.map((similarEvent) => (
                <Link key={similarEvent.id} href={`/event/₹{similarEvent.id}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <div className="relative aspect-video">
                      <Image
                        src={similarEvent.image || "/placeholder.svg"}
                        alt={similarEvent.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">New</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-1">{similarEvent.name}</h3>
                      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                        <span>Buy now: ₹{similarEvent.price?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetail
