"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export const AnnounecemntBar = () => {
  const { config } = useHomePageConfig();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  // Messages à faire défiler
  const messages = [
    config.announcement_message,
    config.announcement_message_2,
  ].filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="bg-tertiory py-3 text-muted-foreground">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="flex justify-center items-center">
                  <p className="text-center text-sm font-medium px-4">
                    {message}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
