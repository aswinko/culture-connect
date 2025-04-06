import React from "react";
// import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
// import { MapPin, Mic, Star } from 'lucide-react';
import { Button } from "../ui/button";

interface CarouselProps {
  category: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const EventCarouselItem = ({
  category,
  name,
  price,
  image,
  description,
}: CarouselProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <Image
          src={image || "/no-image.png"}
          width={400}
          height={250}
          alt={name}
          className="aspect-video object-cover w-full"
        />
        <Badge className="absolute top-4 right-4 px-3 py-1">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl">{name}</h3>
          <div className="flex items-center text-sm text-muted-foreground line-clamp-4">
            {description}
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="font-bold">₹ {price}</p>
            <Button size="sm">Book Now</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCarouselItem;
