"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Camera } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/app/(private)/profile/ProfileClient"

interface ProfileEditDialogProps {
  profile: UserProfile
  onClose: () => void
  onSave: (profile: UserProfile) => void
}

export default function ProfileEditDialog({ profile, onClose, onSave }: ProfileEditDialogProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...profile })
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = () => {
    // Simulate upload
    setIsUploading(true)
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        avatar_url: "/placeholder.svg?height=200&width=200",
      }))
      setIsUploading(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
              </div>
            </div>            
          </div>

          <DialogFooter className="p-6 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
