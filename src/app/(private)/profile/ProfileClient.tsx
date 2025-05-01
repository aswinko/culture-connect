"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getCurrentUser, getUserProfile, updateUserProfile } from "@/app/actions/auth-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone, Edit, Share2, MapPin, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventDialog from "@/components/layout/Event-Dialog"
import { toast } from "sonner"
import ProfileEditDialog from "@/components/layout/ProfileEditDialog"

export interface UserProfile {
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  // useEffect(() => {
  //   async function fetchProfile() {
  //     const data = await getUserProfile();
  //     setProfile(data);
  //   }
  //   fetchProfile();
  // }, []);
  
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true)
      try {
        const data = await getUserProfile()
        setProfile(data)
      } catch (error) {
        toast.error("Could not load your profile information")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [toast])

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    try {
      const user = await getCurrentUser();
  
      
      if (!user || !user.user_id) {
        toast.error("User not found");
        return;
      }
  
      const formData = new FormData();
      formData.append("full_name", updatedProfile.full_name || "");
      formData.append("phone", updatedProfile.phone || "");
      formData.append("bio", updatedProfile.bio || "");
  
      await updateUserProfile(user?.user_id ?? "", formData);
  
      setProfile(updatedProfile);
      toast.success("Your profile has been updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Could not update your profile");
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto p-6 flex flex-col gap-8 min-h-screen max-w-7xl"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="w-full">
          <Card className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg">
            <div className="h-32 bg-gradient-to-r from-blue-500/80 to-purple-600/80"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row gap-6 -mt-12">
                <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                  {isLoading ? (
                    <Skeleton className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800" />
                  ) : (
                    <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-md">
                      <AvatarImage src={profile?.avatar_url || "/default-avatar.png"} alt={profile?.full_name} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
                <div className="flex-1 pt-3 md:pt-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      {isLoading ? (
                        <Skeleton className="h-8 w-48 mb-2" />
                      ) : (
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile?.full_name}</h1>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: User Info */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-md h-full">
              <CardHeader>
                <h2 className="text-xl font-semibold">About</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile?.bio || "No bio provided. Click edit to add your bio."}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {isLoading ? <Skeleton className="h-4 w-40" /> : <span>{profile?.email}</span>}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {isLoading ? <Skeleton className="h-4 w-32" /> : <span>{profile?.phone || "No phone number"}</span>}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {isLoading ? (
                      <Skeleton className="h-4 w-36" />
                    ) : (
                      <span>
                        Member since{" "}
                        {new Date(profile?.created_at || "").toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Tabs for Listings/Events */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-md h-full">
              <CardContent className="p-6">

                  {/* <TabsContent value="events" className="mt-0"> */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-10 w-10 text-purple-500 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Your Next Great Adventure Starts Here!
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                        Create an event and connect with people who share your interests.
                      </p>
                      <Button
                        onClick={() => setIsEventDialogOpen(true)}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Create Event
                      </Button>
                    </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Dialogs */}
      {isEventDialogOpen && <EventDialog onClose={() => setIsEventDialogOpen(false)} />}
      {isEditDialogOpen && profile && (
        <ProfileEditDialog profile={profile} onClose={() => setIsEditDialogOpen(false)} onSave={handleProfileUpdate} />
      )}
    </>
  );
};

export default Profile;
