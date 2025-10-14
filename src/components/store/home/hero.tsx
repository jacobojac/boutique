"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import Image from "next/image";

export default function Hero() {
  const { config, isLoading } = useHomePageConfig();

  if (isLoading) {
    return (
      <section className="relative">
        <div className="relative h-[600px] overflow-hidden bg-gray-200 animate-pulse">
          {/* Skeleton loader */}
        </div>
      </section>
    );
  }
  return (
    <section className="relative">
      <div className="relative h-[600px] overflow-hidden">
        {/* Background image with sophisticated overlay */}
        <div className="absolute inset-0">
          <Image
            src={config.homepage_hero_image}
            alt="Collection mode féminine exclusive"
            fill
            className="object-cover object-top-center"
            priority
            quality={95}
          />
          {/* Multi-layer overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div> */}
        </div>

        {/* Geometric elements for visual interest */}
        <div className="absolute top-1/4 right-20 w-1 h-32 bg-white/20 rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-1/3 right-32 w-1 h-20 bg-white/10 -rotate-12 hidden lg:block"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center w-full md:w-2/3 lg:w-1/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <div className="space-y-10">
                {/* Badge with enhanced styling */}
                <div className="inline-flex items-center px-6 py-3 border border-white/30 backdrop-blur-sm bg-white/5">
                  <span className="text-white text-sm font-medium tracking-wide uppercase">
                    {config.homepage_hero_subtitle}
                  </span>
                </div>

                {/* Main heading with better hierarchy */}
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-10 lg:leading-16">
                    {config.homepage_hero_title}
                  </h1>
                </div>

                {/* Enhanced CTA section */}
                {/* <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <Link href="/categories/femmes" className="group">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 font-medium px-4 py-2 text-lg transition-all duration-500 group-hover:scale-105 shadow-2xl hover:shadow-white/20"
                    >
                      {config.buttonText}
                      <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
