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
    config.announcement_message || "Livraison gratuite dès 50€ d'achat",
    config.announcement_message_2 ||
      "🔥 Profitez de nos codes de réduction sur tous nos produits !",
  ];

  return (
    <div className="w-full md:max-w-7xl md:mx-auto md:px-8">
      <div className="bg-black text-white py-2">
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
