"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

const imageData = ["/img-slider1.png", "/img-slider2.png", "/img-slider3.png", "/img-slider4.png"];

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
            <Card className="relative w-full h-[500px] rounded-xl overflow-hidden">
            <CardContent className="w-full h-full p-0 items-center justify-center px-6 ">
                  {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                  <Image fill src={data} alt={`Slide ${index + 1}`} className="object-cover w-full h-full"/>
 
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  )
}
