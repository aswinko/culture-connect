import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategoryById, getEventById } from "@/app/actions/event-actions";
import Navbar from "@/components/layout/Navbar";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

const EventDetailsPage = async ({ params }: Params) => {
  const id = (await params).id;

  if (!id){
      return <div>Not found</div>
  }
const event = await getEventById(id);
//   console.log(product);
let category = null
if (event) {
 // 🔹 Fetch category name separately
 category = await getCategoryById(event.category_id);
} else {
 // Handle the case where product is null
 category = null; // or handle accordingly
}

  // Find the event by ID

  if (!event) {
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
      <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg transition-all">
        {/* Event Image */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={event.image || "/no-image.png"}
            alt={event.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Event Details */}
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-700 dark:text-gray-300">{event.description}</p>

        {/* Price & Event Type */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">₹{event.price}</span>
          <span className="text-gray-600 dark:text-gray-400">
            Event Type: {category?.name || "N/A"}
          </span>
        </div>

        {/* Organizer Section */}
        <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Organizer" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">Aswin K O</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Verified Organizer</p>
          </div>
        </div>

        {/* Bid Now Button */}
        <Button variant={"default"} className="w-full dark:text-white  dark:bg-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition">
          Bid Now
        </Button>

        {/* Video Preview (Optional) */}
        {/* {event.videoUrl && (
          <div className="w-full mt-6">
            <video className="w-full rounded-lg shadow-md" controls autoPlay>
              <source src={event.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )} */}
      </div>
    </>
  );
};

export default EventDetailsPage;
