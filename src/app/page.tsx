// import LogoutBtn from "@/components/Authentication/LogoutBtn";
import { EventCard } from "@/components/layout/EventCard";
import { events } from "@/lib/data";
import Link from "next/link";
// import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // const supabase = await createClient()

  // const { data } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   redirect('/login')
  // }
  return (
    <div className="md:container mx-4 md:mx-auto mt-2">
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

    {events.map((data, index) => (
      <Link href={`/event/${data?.id}`} className="hover:scale-[102%] transition-transform duration-300" key={index}>
        <EventCard title={data?.eventName} description={data?.description} imageUrl={data?.imageUrl} price={data?.price} />
      </Link>
    ))}
      </div>
    </div>
  );
}
