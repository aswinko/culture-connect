"use client"

import { useState, useEffect, useId } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, MapPin, Users, Info, Star, Gavel, AlertTriangle, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
// import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Event } from "@/types/Event"
import { placeBid } from "@/app/actions/bid-actions"


const EventDetail = ({ event, userId, bids }: { event: Event; userId: string; bids: {id: string; userName: string; time: Date; amount: number; status: string;}[] }) => {
    const [bidAmount, setBidAmount] = useState<number>(event ? event.current_bid + 500 : 0);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const toastId = useId()
  
    const router = useRouter()
    // const { toast } = useToast()
  
    // Calculate time left for bidding
    useEffect(() => {
      if (!event) return
  
      const updateTimeLeft = () => {
        const now = new Date()
        if (now > event?.bidding_ends_at) {
          setTimeLeft("Bidding closed")
          return
        }
  
        setTimeLeft(formatDistanceToNow(event?.bidding_ends_at, { addSuffix: true }))
      }
  
    //   updateTimeLeft()
      const interval = setInterval(updateTimeLeft, 60000) // Update every minute
  
      return () => clearInterval(interval)
    }, [event])
  
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
  
    // Calculate bid progress percentage
    const bidProgressPercentage = Math.min(
      Math.max(((event?.current_bid - event?.starting_price) / (event?.ending_price - event?.starting_price)) * 100, 0),
      100,
    )


  
    const handleBidSubmit = async () => {
        if (!event) return
      
        if (bidAmount <= event.current_bid) {
          toast.warning(
            `Your bid must be higher than the current bid of ₹{event.current_bid.toLocaleString()}.`,
            { id: toastId }
          )
          return
        }
      
        setIsSubmitting(true)
      
        try {
        if (!event?.id) {
            toast.error("Event ID is not available.", { id: toastId });
            return;
            }
          const result = await placeBid(event?.id, bidAmount, userId)
      
          if (!result.success) {
            toast.error(result.message || "Failed to place bid.", { id: toastId })
            return
          }
      
          toast.success(
            `You are now the highest bidder at ₹{bidAmount.toLocaleString()}.`,
            { id: toastId }
          )
          setIsDialogOpen(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error("Something went wrong while placing your bid.", { id: toastId })
        } finally {
          setIsSubmitting(false)
        }
      }
      
  return (
    <>
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
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
              <Badge className="absolute top-4 left-4 bg-primary/80 hover:bg-primary">Bidding Open</Badge>
            </div>
          </div>

          {/* Bidding Card */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Event Bidding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Starting Price</span>
                    <span>₹{event?.starting_price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buy Now Price</span>
                    <span>₹{event?.ending_price?.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Current Bid</span>
                    <span className="text-primary">₹{event?.current_bid?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    {/* <span className="text-muted-foreground">Bid by {event?.bids[0]?.userName}</span> */}
                    <span className="text-muted-foreground">
                      {/* {formatDistanceToNow(event?.bids[0]?.time, { addSuffix: true })} */}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bid Progress</span>
                    <span>{Math.round(bidProgressPercentage)}%</span>
                  </div>
                  <Progress value={bidProgressPercentage} className="h-2" />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4 text-amber-500" />
                  <span>Bidding ends {timeLeft}</span>
                </div>

                <div className="space-y-2">
                {event.current_bid >= event.price ? (
                    <>
                        <Button className="w-full" size="lg" disabled>
                        <Gavel className="mr-2 h-5 w-5" />
                        Place Bid
                        </Button>
                        <p className="text-sm text-red-500 mt-2 text-center">
                        Bidding disabled – Total price reached
                        </p>
                    </>
                    ) : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                            <Gavel className="mr-2 h-5 w-5" />
                            Place Bid
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Place Your Bid</DialogTitle>
                            <DialogDescription>
                            Enter your bid amount for &quot;{event?.name}&quot;. The minimum bid is ₹
                            {(event?.current_bid + 100).toLocaleString()}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                            <Label htmlFor="bid-amount">Bid Amount (₹)</Label>
                            <Input
                                id="bid-amount"
                                type="number"
                                min={event?.current_bid + 100}
                                step={100}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(Number(e.target.value))}
                            />
                            </div>
                            <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <p>
                                By placing a bid, you agree to book this event if you are the highest bidder when the
                                bidding ends.
                            </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                            </Button>
                            <Button onClick={handleBidSubmit} disabled={isSubmitting || bidAmount <= (event.current_bid || 0)}>
                            {isSubmitting ? "Processing..." : "Confirm Bid"}
                            </Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    )}


                  {/* <Button variant="outline" className="w-full" onClick={() => setBidAmount(event?.ending_price || 0)} disabled={event.current_bid >= event.price}>
                    Buy Now at ₹{event?.ending_price?.toLocaleString()}
                  </Button> */}
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>
                      The highest bidder at the end of the bidding period will secure this event. A 20% deposit is
                      required within 24 hours of winning.
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{event?.date ? format(event.date, "MMMM d, yyyy") : "Date not available"}</p>                
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">{event?.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event?.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-muted-foreground">{event?.capacity} attendees</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
                <TabsTrigger value="bids">Bid History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4 space-y-4">
                <p className="text-muted-foreground">{event?.long_description}</p>
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
              <TabsContent value="bids" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bidder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { bids && Array.isArray(bids) && bids.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">    
                              <AvatarImage src={`/placeholder.svg?text=₹{bid.userName.charAt(0)}`} />
                              <AvatarFallback>{bid.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{bid.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>₹{bid.amount.toLocaleString()}</TableCell>
                        <TableCell>{formatDistanceToNow(bid.time, { addSuffix: true })}</TableCell>
                        <TableCell>
                          {bid.status === "highest" ? (
                            <Badge className="bg-green-500 hover:bg-green-600">Highest</Badge>
                          ) : (
                            <Badge variant="outline">Outbid</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>

            <div>
              <h3 className="text-xl font-bold mb-4">About the Organizer</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?text=₹{event?.organizer?.charAt(0)}`} />
                      <AvatarFallback>{event?.organizer?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{event?.organizer}</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Professional event organizer with over 10 years of experience in hosting premium events.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bidding Rules */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Bidding Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">How Bidding Works</h4>
                  <p className="text-sm text-muted-foreground">
                    Place your bid for this event. The highest bidder when the bidding period ends will secure the
                    booking.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Minimum Bid Increment</h4>
                  <p className="text-sm text-muted-foreground">
                    Each new bid must be at least ₹100 higher than the current highest bid.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Deposit Requirement</h4>
                  <p className="text-sm text-muted-foreground">
                    The winning bidder must pay a 20% non-refundable deposit within 24 hours of the bidding end.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Buy Now Option</h4>
                  <p className="text-sm text-muted-foreground">
                    Skip the bidding process by selecting the &quot;Buy Now&quot; option at the listed price.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Cancellation Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Cancellations made more than 30 days before the event date are eligible for a 50% refund of the
                    amount paid beyond the non-refundable deposit.
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
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(events)
              .filter((e) => e.id !== eventId)
              .map((similarEvent) => (
                <Link key={similarEvent.id} href={`/event/₹{similarEvent.id}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <div className="relative aspect-video">
                      <Image
                        src={similarEvent.images[0] || "/placeholder.svg"}
                        alt={similarEvent.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">Bidding</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-1">{similarEvent.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{format(similarEvent.date, "MMMM d, yyyy")}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1">
                          <Gavel className="h-3 w-3 text-primary" />
                          <span className="text-xs text-muted-foreground">Current bid:</span>
                        </div>
                        <p className="text-sm font-bold">₹{similarEvent.currentBid.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                        <span>Starting: ₹{similarEvent.startingPrice.toLocaleString()}</span>
                        <span>Buy now: ₹{similarEvent.endingPrice.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div> */}
        </div>
      </div>
    </>
  )
}

export default EventDetail
