"use client"

// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions/auth-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventDialog from "@/components/layout/Event-Dialog";

const Profile = () => {
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
    phone?: string;
    bio?: string;
    role: string;
    avatar_url?: string;
    created_at: string;
  } | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const data = await getUserProfile();
      setProfile(data);
    }
    fetchProfile();
  }, []);

  return (
    <>      
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 h-screen">
        {/* Left Side: Profile Info */}
        <Card className="p-6 md:max-w-sm shadow-accent bg-white dark:bg-gray-900 transition-all h-fit">
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            {profile ? (
              <Avatar className="w-24 h-24 border-4 border-gray-300 dark:border-gray-700">
                <AvatarImage src={profile.avatar_url || "/default-avatar.png"} alt={profile.full_name} />
                <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="w-24 h-24 rounded-full" />
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile ? profile.full_name : <Skeleton className="w-40 h-6" />}
            </h1>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <p>
                Member since {profile ? new Date(profile.created_at).toLocaleString("en-US", { month: "short", year: "numeric" }) : <Skeleton className="w-20 h-4" />}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-3">
            <Button variant="outline" className="w-full">
              ✏️ Edit Profile
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 underline cursor-pointer">
              Share Profile
            </p>
          </CardContent>
        </Card>

        {/* Right Side: No Listings Message */}
        <Card className="p-6 border-0 col-span-2 max-w-full shadow-accent bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
          {/* <Image fill src="/empty-listing.svg" alt="No Listings" className="w-32 h-32" /> */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">Your Next Great Adventure Starts Here!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Let go of what you dont use anymore</p>
          <Button 
            className="mt-4"  
            onClick={() => {
              setIsOpen(true);
            }}
          > 
            Create Event
          </Button>
        </Card>
        {
          isOpen && <EventDialog onClose={() => setIsOpen(false)} />
        }

        {/* <EventForm /> */}
      </div>
    </>
  );
};

export default Profile;
