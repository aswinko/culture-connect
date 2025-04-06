"use client"

import { Separator } from "@/components/ui/separator"

import { useId, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Clock,
  Gavel,
  AlertCircle,
  XCircle,
  Filter,
  CreditCard,
  CheckCheck,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format, formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { payBidDeposit } from "@/app/actions/payment-actions"

interface Bid {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventImage: string;
  bidAmount: number;
  bidTime: Date;
  currentBid: number;
  biddingEndsAt: Date;
  status: "highest" | "outbid" | "won" | "lost" | "paid";
  startingPrice: number;
  endingPrice: number;
  depositPaid: boolean;
  paymentDate?: Date;
}

export default function MyBidsPage({myBids, user_id}: {myBids: Bid[]; user_id: string;}) {
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const router = useRouter()
  const toastId = useId()

  // Filter bids based on active tab
  const filteredBids = myBids.filter((bid) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return bid.status === "highest" || bid.status === "outbid"
    if (activeTab === "won") return bid.status === "won" || bid.status === "paid"
    if (activeTab === "lost") return bid.status === "lost"
    return true
  })

  // Sort bids
  const sortedBids = [...filteredBids].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        // return b.bidTime.getTime() - a.bidTime.getTime()
        return new Date(b.bidTime || 0).getTime() - new Date(a.bidTime || 0).getTime()

      case "oldest":
        // return a.bidTime.getTime() - b.bidTime.getTime()
        return new Date(a.bidTime || 0).getTime() - new Date(b.bidTime || 0).getTime()

      case "highestAmount":
        return b.bidAmount - a.bidAmount
      case "lowestAmount":
        return a.bidAmount - b.bidAmount
      default:
        return 0
    }
  })

  // Get status badge
  const getStatusBadge = (status: string, depositPaid: boolean) => {
    if (status === "won" && !depositPaid) {
      return <Badge className="bg-green-500 hover:bg-green-600">Deposit Paid</Badge>
    }

    switch (status) {
      case "highest":
        return <Badge className="bg-green-500 hover:bg-green-600">Highest Bid</Badge>
      case "outbid":
        return <Badge variant="destructive">Outbid</Badge>
      case "won":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Won</Badge>
      case "lost":
        return <Badge variant="outline">Lost</Badge>
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Deposit Paid</Badge>
      default:
        return null
    }
  }

  const handlePayDeposit = (bid: Bid) => {
    console.log("fvf",!bid.depositPaid);
    
    setSelectedBid(bid)
    setIsPaymentDialogOpen(true)
  }

  const processPayment = async () => {
    setIsProcessingPayment(true)
  
    setTimeout(async () => {
      if (selectedBid) {
        const bidIndex = myBids.findIndex((b) => b.id === selectedBid.id)
        if (bidIndex !== -1) {
          myBids[bidIndex].depositPaid = true
          myBids[bidIndex].status = "paid"
          myBids[bidIndex].paymentDate = new Date()
        }

        console.log(selectedBid);
        
  
        try {
          await payBidDeposit({
            bidId: selectedBid.id,
            userId: user_id,
            eventId: selectedBid.eventId,
            amount: selectedBid.bidAmount * 0.2,
          })
  
          toast.success("Payment successful and recorded!", { id: toastId })
        } catch (error) {
          console.error("Payment action failed:", error)
          toast.error("Payment processed, but failed to record it.")
        }
      }
  
      setIsProcessingPayment(false)
      setIsPaymentDialogOpen(false)
      router.refresh()
    }, 2000)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bids</h1>
            <p className="text-muted-foreground">Track and manage your event bids</p>
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highestAmount">Highest Amount</SelectItem>
                <SelectItem value="lowestAmount">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Bids</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
          </TabsList>
        </Tabs>

        {sortedBids.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <Gavel className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No bids found</h2>
                <p className="text-muted-foreground mb-6">You haven&apos;t placed any bids in this category yet.</p>
                <Button asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedBids.map((bid) => (
                
              <Card key={bid.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr_200px]">
                  <div className="relative h-40 md:h-full">
                    <Image
                      src={bid.eventImage || "/placeholder.svg"}
                      alt={bid.eventName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold">{bid.eventName}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(bid.eventDate, "MMMM d, yyyy")}</span>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1">
                        {getStatusBadge(bid.status,!bid.depositPaid)}
                        <span className="text-xs text-muted-foreground">
                          Bid placed {formatDistanceToNow(bid.bidTime, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Bid</p>
                        <p className="font-bold">₹{bid.bidAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Highest Bid</p>
                        <p
                          className={`font-bold ${bid.status === "highest" || bid.status === "won" || bid.status === "paid" ? "text-green-600" : ""}`}
                        >
                          ₹{bid.currentBid.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {(bid.status === "highest" || bid.status === "outbid") && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bid Progress</span>
                          <span>
                            {Math.round(
                              ((bid.currentBid - bid.startingPrice) / (bid.endingPrice - bid.startingPrice)) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            Math.max(
                              ((bid.currentBid - bid.startingPrice) / (bid.endingPrice - bid.startingPrice)) * 100,
                              0,
                            ),
                            100,
                          )}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Starting: ₹{bid.startingPrice.toLocaleString()}</span>
                          <span>Buy now: ₹{bid.endingPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {bid.status === "outbid" && (
                      <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded mt-4">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>You&apos;ve been outbid! Place a new bid to secure this event.</p>
                      </div>
                    )}

                    {bid.status === "won" && !bid.depositPaid && (
                      <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded mt-4">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Congratulations! You won this auction.</p>
                          <p className="mt-1">
                            Please pay the 20% deposit (₹{(bid.bidAmount * 0.2).toLocaleString()}) within 24 hours to
                            secure your booking.
                          </p>
                        </div>
                      </div>
                    )}

                    {bid.status === "paid" && bid.depositPaid && (
                      <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 p-2 rounded mt-4">
                        <CheckCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Deposit paid successfully!</p>
                          <p className="mt-1">
                            Your 20% deposit of ₹{(bid.bidAmount * 0.2).toLocaleString()} was paid on{" "}
                            {bid.paymentDate ? format(bid.paymentDate, "MMMM d, yyyy") : ""}.
                          </p>
                        </div>
                      </div>
                    )}

                    {bid.status === "lost" && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-2 rounded mt-4">
                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>This auction has ended. Unfortunately, you were outbid.</p>
                      </div>
                    )}
                  </CardContent>

                  <div className="border-t md:border-t-0 md:border-l p-6 flex flex-col justify-center">
                    {bid.status === "highest" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Bidding ends {formatDistanceToNow(bid.biddingEndsAt, { addSuffix: true })}</span>
                        </div>
                        <Button asChild className="w-full">
                          <Link href={`/event/${bid.eventId}`}>View Event</Link>
                        </Button>
                        <Button variant="outline" className="w-full">
                          Increase Bid
                        </Button>
                      </div>
                    )}

                    {bid.status === "outbid" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Bidding ends {formatDistanceToNow(bid.biddingEndsAt, { addSuffix: true })}</span>
                        </div>
                        <Button asChild className="w-full">
                          <Link href={`/event/${bid.eventId}`}>Place New Bid</Link>
                        </Button>
                      </div>
                    )}

                    {bid.status === "won" && !bid.depositPaid && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span>Deposit Required: ₹{(bid.bidAmount * 0.2).toLocaleString()}</span>
                        </div>
                        <Button className="w-full" onClick={() => handlePayDeposit(bid)}>
                          Pay 20% Deposit
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/event/${bid.eventId}`}>View Event Details</Link>
                        </Button>
                      </div>
                    )}

                    {bid.status === "paid" && bid.depositPaid && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCheck className="h-4 w-4 text-green-600" />
                          <span>Deposit Paid: ₹{(bid.bidAmount * 0.2).toLocaleString()}</span>
                        </div>
                        <Button asChild className="w-full">
                          <Link href={`/booking/${bid.id}`}>View Booking Details</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/event/${bid.eventId}`}>View Event</Link>
                        </Button>
                      </div>
                    )}

                    {bid.status === "lost" && (
                      <div className="space-y-2">
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/event/${bid.eventId}`}>View Event</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/events">Browse Similar Events</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pay 20% Deposit</DialogTitle>
              <DialogDescription>
                Secure your booking by paying the 20% deposit for {selectedBid?.eventName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{selectedBid?.eventName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Date</span>
                  <span>{selectedBid ? format(selectedBid.eventDate, "MMMM d, yyyy") : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Winning Bid</span>
                  <span className="font-medium">₹{selectedBid?.bidAmount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit (20%)</span>
                  <span className="font-bold">
                    ₹{selectedBid ? (selectedBid.bidAmount * 0.2).toLocaleString() : ""}
                  </span>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    This 20% deposit is non-refundable and secures your booking. The remaining 80% will be due 7 days
                    before the event date.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Payment Method</h4>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <input type="radio" id="card" name="paymentMethod" defaultChecked />
                  <label htmlFor="card" className="flex-1 cursor-pointer text-sm">
                    Credit/Debit Card
                  </label>
                  <div className="flex gap-2">
                    <div className="h-6 w-10 rounded bg-muted flex items-center justify-center text-xs">VISA</div>
                    <div className="h-6 w-10 rounded bg-muted flex items-center justify-center text-xs">MC</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <input type="radio" id="paypal" name="paymentMethod" />
                  <label htmlFor="paypal" className="flex-1 cursor-pointer text-sm">
                    PayPal
                  </label>
                  <div className="h-6 w-10 rounded bg-muted flex items-center justify-center text-xs">PP</div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={processPayment} disabled={isProcessingPayment}>
                {isProcessingPayment
                  ? "Processing..."
                  : `Pay ₹${selectedBid ? (selectedBid.bidAmount * 0.2).toLocaleString() : ""}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

