"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PromoSection() {
  const { config, isLoading } = useHomePageConfig();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!config.selectedDiscount || !config.selectedDiscount.expiresAt) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const endDate = new Date(config.selectedDiscount.expiresAt);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.selectedDiscount]);
  // Vérifier si le timer est expiré (tous les champs à 0)
  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isLoading) {
    return null; // ou un skeleton loader si souhaité
  }

  return (
    <>
      {config.promo_discount_enabled &&
        config.selectedDiscount &&
        !isExpired && (
          <section className="pt-4 pb-20 bg-white">
            <div className="md:max-w-7xl md:mx-auto w-full">
              <div className="relative overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={config.promo_section_image}
                    alt="Promo background"
                    fill
                    className="object-cover"
                    quality={90}
                  />
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/90"></div>
                </div>

                <div className="relative px-8 md:px-16 py-10 flex justify-center">
                  <div className="max-w-lg">
                    {/* Section réduction */}
                    <div className="mb-4 flex flex-col items-center">
                      <h2 className="text-white/90 text-2xl mb-3 text-center font-semibold">
                        {config.promo_discount_text}
                      </h2>

                      {/* Timer décroissant */}
                      <div className="mb-4">
                        <p className="text-yellow-300 text-xl font-medium mb-8 text-center">
                          OFFRE LIMITÉE
                        </p>
                        <div className="flex gap-2">
                          <div className="bg-white text-black px-3 py-2 rounded-lg text-center min-w-[60px]">
                            <div className="text-xl font-bold">
                              {timeLeft.days.toString().padStart(2, "0")}
                            </div>
                            <div className="text-xs">JOURS</div>
                          </div>
                          <div className="bg-white text-black px-3 py-2 rounded-lg text-center min-w-[60px]">
                            <div className="text-xl font-bold">
                              {timeLeft.hours.toString().padStart(2, "0")}
                            </div>
                            <div className="text-xs">HEURES</div>
                          </div>
                          <div className="bg-white text-black px-3 py-2 rounded-lg text-center min-w-[60px]">
                            <div className="text-xl font-bold">
                              {timeLeft.minutes.toString().padStart(2, "0")}
                            </div>
                            <div className="text-xs">MIN</div>
                          </div>
                          <div className="bg-white text-black px-3 py-2 rounded-lg text-center min-w-[60px]">
                            <div className="text-xl font-bold">
                              {timeLeft.seconds.toString().padStart(2, "0")}
                            </div>
                            <div className="text-xs">SEC</div>
                          </div>
                        </div>
                      </div>

                      {config.selectedDiscount &&
                        config.selectedDiscount.code && (
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-white/80 text-sm">
                              Code de réduction :
                            </span>
                            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2">
                              <span className="text-white font-mono text-lg font-bold tracking-wider">
                                {config.selectedDiscount.code}
                              </span>
                            </div>
                            <span className="text-gray-200 text-sm italic">
                              Minimum d&#39;achat de{" "}
                              {config.selectedDiscount.minAmount}€
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-12 right-24 w-8 h-8 bg-white/10 rounded-full"></div>
              </div>
            </div>
          </section>
        )}
    </>
  );
}
