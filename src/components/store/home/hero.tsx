"use client";

import { Button } from "@/components/ui/button";
import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const { config, isLoading } = useHomePageConfig();

  if (isLoading) {
    return (
      <section className="relative">
        <div className="relative h-[750px] overflow-hidden bg-gray-200 animate-pulse">
          {/* Skeleton loader */}
        </div>
      </section>
    );
  }
  return (
    <section className="relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-[100vw]">
      <div className="relative h-[650px] md:h-[750px] overflow-hidden">
        {/* Background image with sophisticated overlay */}
        <div className="absolute inset-0">
          <Image
            src={config.homepage_hero_image}
            alt="bannière principale"
            fill
            className="object-cover object-top-center"
            priority
            quality={95}
          />
          {/* Multi-layer overlay for depth */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent"></div>
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent"></div>
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div> */}
        </div>

        {/* Geometric elements for visual interest */}
        {/* <div className="absolute top-1/4 right-20 w-1 h-32 bg-white/20 rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-1/3 right-32 w-1 h-20 bg-white/10 -rotate-12 hidden lg:block"></div> */}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center w-full md:w-2/3 lg:w-1/2">
          <div className="px-4 sm:px-6 lg:p w-full pt-[55%] md:pt-0 flex justify-center">
            <div className="max-w-4xl">
              <div className="space-y-1">
                {/* Badge with enhanced styling */}
                <div className="inline-flex items-center">
                  <span className="text-white text-5xl md:text-6xl tracking-wide uppercase">
                    <span className="font-semibold">ELITE</span>{" "}
                    <span className="font-light">CORNER</span>
                  </span>
                </div>

                {/* Main heading with better hierarchy */}
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-3xl leading-10 lg:leading-16 text-gray-200">
                    {config.homepage_hero_title}
                  </h1>
                </div>

                {/* Enhanced CTA section */}
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <a href="#featured-products" className="group">
                    <Button
                      size="lg"
                      className="bg-black text-white hover:bg-gray-100 hover:text-black font-medium px-4 py-2 transition-all duration-500 group-hover:scale-105 shadow-2xl hover:shadow-white/20"
                    >
                      {config.homepage_hero_button_text}
                      <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
