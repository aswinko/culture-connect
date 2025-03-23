// import LogoutBtn from "@/components/Authentication/LogoutBtn";
import { EventCard } from "@/components/layout/EventCard";
import { ImageCarousel } from "@/components/layout/Image-Carousel";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getAllEvents } from "./actions/event-actions";

export default async function Home() {

  const events = await getAllEvents();

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

          <section className="container mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {events.map((event: { id: string; name: string; description: string; image: string; price: number }, index: number) => (
              <Link href={`/event/${event.id}`} className="hover:scale-[102%] transition-transform duration-300" key={index}>
                <EventCard title={event.name} description={event.description} imageUrl={event.image} price={event.price} />
              </Link>
            ))}
          </section>
        </main>
    </div>
    </>
  );
}
