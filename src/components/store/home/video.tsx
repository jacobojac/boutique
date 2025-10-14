"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";

export default function Video() {
  const { config, isLoading } = useHomePageConfig();

  if (isLoading) {
    return (
      <section className="pt-4 pb-20 bg-white">
        <div className="md:max-w-7xl md:mx-auto w-full">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-y-12 md:gap-x-28 md:px-0">
              <div className="space-y-6 md:col-span-1">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-12 bg-gray-200 rounded w-4/5"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
              <div className="aspect-w-16 aspect-h-9 md:col-span-1">
                <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-20 bg-white">
      <div className="md:max-w-7xl md:mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-y-12 md:gap-x-28 md:px-0">
          {/* Contenu textuel */}
          <div className="space-y-6 md:col-span-1">
            <div className="space-y-4">
              <div className="mb-4">
                <span className="inline-block bg-black text-white px-3 py-1 rounded text-sm font-medium">
                  IW STORE
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {config.promo_section_title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {config.promo_section_description}
              </p>
            </div>
          </div>

          {/* Vidéo */}
          <div className="aspect-w-16 aspect-h-9 md:col-span-1">
            <video
              src="/video/video-bag.mp4"
              title="Video player"
              controls
              muted
              className="w-full h-full rounded-lg"
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
