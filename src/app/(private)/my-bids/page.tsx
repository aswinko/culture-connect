import React from 'react'
import MyBidsPage from './MyBidsClient'
import { getAllLatestBidsOfUser } from '@/app/actions/bid-actions'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const page = async () => {
    const supabase = await createClient()
    const {data: { user }} = await supabase.auth.getUser();  
    if (!user) return <div>User Not Found</div>; 

    const bids = await getAllLatestBidsOfUser(user ? user.id : '')
    if (!bids) return <div>Bids not found!</div>;

    // Transform the bids data to match the Bid interface
    const transformedBids = bids.bids?.map(bid => {
        const eventDate = new Date(bid.event.biddingEndsAt)
        const isEventOver = eventDate < new Date()
        const isHighestBid = bid.amount === bid.event.currentBid
        const status = isEventOver && isHighestBid ? "won" : bid.status

        return {
            id: bid.id,
            eventId: bid.eventId,
            eventName: bid.event.name,
            eventDate: eventDate,
            eventImage: bid.event.image,
            bidAmount: bid.amount,
            bidTime: new Date(bid.time),
            currentBid: bid.event.currentBid,
            biddingEndsAt: new Date(bid.event.biddingEndsAt),
            status: status as "highest" | "outbid" | "won" | "lost" | "paid",
            startingPrice: bid.event.startingPrice,
            endingPrice: bid.event.endingPrice,
            depositPaid: bid.event.depositPaid,
        }
    }) || []
    
    return (
        <>
            <Navbar />
            <MyBidsPage myBids={transformedBids} user_id={user ? user.id : ''} />
            <Footer />
        </>
    )
}

export default page
