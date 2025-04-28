"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

const imageData = ["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"];

export function ImageCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-full pt-0 rounded-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="rounded-lg">
        {imageData.map((data, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
            <Card className="relative w-full h-[80vh] rounded-xl overflow-hidden">
            <CardContent className="w-full h-full p-0 items-center justify-center px-6 ">
                  {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                  <Image fill src={data} alt={`Slide ${index + 1}`} className="object-cover w-full h-full"/>
 
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 bg-inherit" />
      <CarouselNext className="absolute right-2 bg-inherit " />
    </Carousel>
  )
}
