"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { updateEventDetails, uploadEventImage, uploadEventVideo } from "@/app/actions/event-actions"

interface EventCardProps {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  videoUrl?: string
  category_id?: string
  categories: Category[] 
  features?: string[] 
  agendas?: string[]  
}

interface Category {
  id: number
  name: string
}

export function EventCard({
  id,
  title,
  description,
  price,
  imageUrl,
  videoUrl,
  category_id,
  categories,
  features: initialFeatures = [],
  agendas: initialAgendas = [],
}: EventCardProps) {
  const supabase = createClient();

  // Explicit type annotations for state variables
  const [editTitle, setEditTitle] = React.useState<string>(title)
  const [editDescription, setEditDescription] = React.useState<string>(description)
  const [editPrice, setEditPrice] = React.useState<number>(price)
  const [editCategory, setEditCategory] = React.useState<string>(category_id || "")
  const [previewImage, setPreviewImage] = React.useState<string>(imageUrl)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [videoFile, setVideoFile] = React.useState<File | null>(null)
  const [previewVideoUrl, setPreviewVideoUrl] = React.useState<string>(videoUrl || "")
  const [featureInput, setFeatureInput] = React.useState<string>("")
  const [features, setFeatures] = React.useState<string[]>(initialFeatures)
  const [agendaInput, setAgendaInput] = React.useState<string>("")
  const [agendas, setAgendas] = React.useState<string[]>(initialAgendas || []);
  const [errors, setErrors] = React.useState<{ features?: { message: string } }>({})
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setPreviewVideoUrl(URL.createObjectURL(file))
    }
  }

  const handleAddFeature = () => {
    if (!featureInput.trim()) {
      setErrors({ features: { message: "Feature cannot be empty" } })
      return
    }
    setFeatures([...features, featureInput])
    setFeatureInput("")
    setErrors({})
  }

  const handleRemoveFeature = (index: number) => {
    const updated = [...features]
    updated.splice(index, 1)
    setFeatures(updated)
  }

  const handleAddAgenda = () => {
    if (!agendaInput.trim()) {
      return
    }
    setAgendas([...agendas, agendaInput])
    setAgendaInput("")
    setErrors({})
  }

  const handleRemoveAgenda = (index: number) => {
    const updated = [...agendas]
    updated.splice(index, 1)
    setAgendas(updated)
  }

  const handleSave = async () => {
    setLoading(true);

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      toast.error("User not authenticated!");
      setLoading(false);
      return;
    }

    // Image and Video upload handling
    let imageUrlLocal: string | null = imageUrl || null;
    let videoUrlLocal: string | null = videoUrl || null;

    // Upload image if a new one is provided
    if (imageFile && imageFile instanceof File) {
      const { success, error, imageUrl: uploadedImageUrl } = await uploadEventImage(imageFile);
      if (!success) {
        toast.error(error || "Image upload failed");
        setLoading(false);
        return;
      }
      imageUrlLocal = uploadedImageUrl || null;
    }

    // Upload video if a new one is provided
    if (videoFile && videoFile instanceof File) {
      const { success, error, videoUrl: uploadedVideoUrl } = await uploadEventVideo(videoFile);
      if (!success) {
        toast.error(error || "Video upload failed");
        setLoading(false);
        return;
      }
      videoUrlLocal = uploadedVideoUrl || null;
    }

    // Update event details with the new image and video URLs if available
    const { success, error } = await updateEventDetails({
      id: id || "",
      name: editTitle,
      price: editPrice,
      description: editDescription,
      category_id: editCategory,
      features,
      image: imageUrlLocal || imageUrl,
      video: videoUrlLocal || videoUrl,
      agendas,
    });

    console.log(success, error);
    

    if (!success && error) {
      toast.error(error || "Failed to update event");
    } else {
      toast.success("Event updated successfully!");
      setLoading(false);
    }
  }

  const categoryName =
    categories.find((cat) => String(cat.id) === category_id)?.name || "Uncategorized";

  return (
    <Card className="w-full md:w-[300px] overflow-hidden shadow-lg gap-2 rounded-none py-4">
      <Dialog>
        <div className="flex justify-end relative">
          <DialogTrigger asChild>
            <Button variant="secondary" className="absolute top-0 right-2 z-10">
              <Edit className="h-6 w-6 text-black" />
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[500px] max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Event description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Highlights</label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                />
                <Button type="button" onClick={handleAddFeature}>
                  Add
                </Button>
              </div>
              {features.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      {feature}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        ✕
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.features && (
                <p className="text-red-500 text-sm">
                  {errors.features.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Agendas</label>
              <div className="flex gap-2">
                <Input
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  placeholder="Add an agenda"
                />
                <Button type="button" onClick={handleAddAgenda}>
                  Add
                </Button>
              </div>
              {agendas.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {agendas.map((agenda, index) => (
                    <li key={index} className="flex justify-between text-sm text-gray-700">
                      {agenda}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAgenda(index)}
                      >
                        ✕
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                placeholder="Event price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Image</label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {previewImage && (
                <div className="mt-2">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={300}
                    height={180}
                    className="rounded-md object-contain"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Video</label>
              <Input type="file" accept="video/*" onChange={handleVideoChange} />
              {previewVideoUrl && (
                <video
                  controls
                  className="w-full mt-2 rounded-md max-h-[200px]"
                  src={previewVideoUrl}
                />
              )}
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>


        {/* Event Image */}
        <div className="relative h-[180px] w-full">
          <Image
            className="px-4"
            src={previewImage || "/no-image.png"}
            alt="Event Image"
            layout="fill"
            objectFit="contain"
          />
        </div>
      <CardContent className="px-6 space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium text-gray-900">₹{price}</span>
          <span className="italic text-sm">{categoryName}</span>
          </div>
      </CardContent>
    </Card>
  )
}
