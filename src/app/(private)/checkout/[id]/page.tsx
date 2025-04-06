import { getEventById } from "@/app/actions/event-actions";
import { CheckoutForm } from "@/components/layout/checkout-form";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/utils/supabase/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function CheckoutPage({ params }: Params) {
  const id = (await params).id;
  if (!id) {
    return <div>Not found</div>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div>User Not Found</div>;

  const event = await getEventById(id);
  if (!event) return <div>Event Not Found</div>;
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Event Booking</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-muted/50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Event Name</p>
                  <p className="font-medium">{event?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{event?.date?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Regular Price</p>
                  <p className="font-medium">₹{event?.price}</p>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">What's Included</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access to all keynote sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Networking opportunities with industry leaders</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Workshop materials and resources</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Lunch and refreshments for all days</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <CheckoutForm eventId={id} userId={user?.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
