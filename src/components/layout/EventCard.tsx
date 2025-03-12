import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react"; // For rating icon
import Image from "next/image";

export function EventCard({title, description, price, imageUrl}) {
  return (
    <Card className="w-full md:w-[300px] overflow-hidden shadow-lg gap-2 rounded-none py-4">
      {/* Event Image */}
      <div className="relative h-[180px] w-full">
        <Image
        className="px-4"
          src={imageUrl} // Replace with your image URL
          alt="Event Image"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <CardContent className="px-6 space-y-1">
        {/* Event Details */}
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* FIXED: Ensuring the description is fully visible */}
           {/* Truncate Description (Fixed) */}
           <p className="text-xs text-gray-600 line-clamp-2">{description}</p>    

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium text-gray-900">₹{price}</span> {/* Event Price */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.5</span> {/* Event Rating */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
