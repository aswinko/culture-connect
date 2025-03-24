import React from 'react'
import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Badge } from '../ui/badge';
// import { MapPin, Mic, Star } from 'lucide-react';
import { Button } from '../ui/button';

interface CarouselProps {
    category: string;
    name: string;
    price: number;
    image: string;
    key: number;
    description: string;
}

const EventCarouselItem = ({category, name, price, image, description, key}: CarouselProps ) => {
  return (
    <CarouselItem key={key} className="pl-4 md:basis-1/2 lg:basis-1/3">
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
                              {/* <div className="flex items-center justify-between">
                                <Badge variant="outline" className="px-2 py-1 text-xs">
                                  {""}
                                </Badge>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                                  {concert.rating} ({concert.reviews})
                                </div>
                              </div> */}
                              <h3 className="font-bold text-xl">{name}</h3>
                              {/* <p className="text-sm text-muted-foreground">{concert.title}</p> */}
                              {/* <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                {concert.location}
                              </div> */}
                              <div className="flex items-center text-sm text-muted-foreground">
                                {description}
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <p className="font-bold">From {price}</p>
                                <Button size="sm">Book Now</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
  )
}

export default EventCarouselItem 
