import { getUserEvents } from '@/app/actions/event-actions'
import { EventCard } from '@/components/layout/EventCard'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const MyEvents = async () => {
    
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    } 

    const events = await getUserEvents();

    const { data: categories = [] } = await supabase.from("categories").select("*")


    if (!Array.isArray(events) || events.length === 0) {
      return (
        <>
          <Navbar />
    
          <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              You have no events
            </h2>
            <Link href={"/profile"} className="px-4 py-3 bg-amber-600 rounded-2xl text-white">
             Create Now
            </Link>
          </div>
        </>
      );
    }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto">
          <h2 className='text-5xl font-bold py-6 text-gray-700'>My Events</h2>
          <section className=" mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events?.map((event: { id: string; name: string; description: string; image: string; price: number; video: string; category_id: string; features: string[]; agendas: string[] }, index: number) => (
              <div className="hover:scale-[102%] transition-transform duration-300" key={index}>
                <EventCard id={event.id} title={event.name} description={event.description} imageUrl={event.image} price={event.price} videoUrl={event.video} category_id={event.category_id} categories={categories} features={event.features} agendas={event.agendas} />
              </div>
            ))}
          </section>
        </main>
    </div>
    
    </>
  )
}

export default MyEvents
