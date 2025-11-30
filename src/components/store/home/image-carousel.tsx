"use client";

import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/images/carousel-images/a07b7b1f-6f06-44c4-9946-f6920397a501_0.png",
  "/images/carousel-images/1764449555607-oyfqzcr2zm8.png",
  "/images/carousel-images/1764452840043-3clk89a43go.png",
  "/images/carousel-images/1764082678435-cuznu76ului.png",
  "/images/carousel-images/b3957f10-047f-4788-8ef1-964061c3880c.png",
  "/images/carousel-images/17642733423272-j1jhytnash.jpeg",
  "/images/carousel-images/1764273523272-j1jhytnash.png",
  "/images/carousel-images/a0733d9b-0adb-403e-a6df-ebd1dbc5282f_0.png",
];

export default function ImageCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-1/1 sm:basis-1/3 md:basis-1/3 lg:basis-1/3"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 relative group">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-12 bg-black"
                  : "w-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
