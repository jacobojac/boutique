"use client";

import { Button } from "@/components/ui/button";
import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Category = {
  title: string;
  image: StaticImageData | string;
  link: string;
  buttonText: string;
  featured?: boolean;
};

export default function CategoriesSection() {
  const { config, isLoading } = useHomePageConfig();

  const categories = useMemo<Category[]>(() => {
    return [
      {
        title: "HOMME",
        buttonText: "Voir la boutique",
        link: "homme",
        image: config.category_homme_image,
        featured: true,
      },
      {
        title: "FEMME",
        buttonText: "Voir la boutique",
        link: "femme",
        image: config.category_femme_image,
        featured: false,
      },
    ];
  }, [config]);

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto sm:px-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="col-span-1 flex justify-between">
                  <div className="w-1/2">
                    <div className="h-80 bg-gray-200"></div>
                  </div>
                  <div className="w-1/2 flex justify-start items-center">
                    <div className="p-6">
                      <div className="h-10 bg-gray-200 w-32 mb-4"></div>
                      <div className="h-8 bg-gray-200 w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto sm:px-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <div className="group col-span-1 flex justify-between" key={index}>
              {/* Image Container */}
              <div className="w-1/2">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={
                      typeof category.image === "string"
                        ? category.image
                        : category.image
                    }
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                </div>
              </div>

              {/* Content */}
              <div className="w-1/2 flex justify-start items-center">
                <div className="p-6 bg-white transition-colors duration-300">
                  <h3 className="text-4xl font-semibold text-black mb-4">
                    {category.title}
                  </h3>
                  <Link href={`/${category.link}`} className="block w-full">
                    <Button
                      size="sm"
                      className="w-full text-white bg-black hover:bg-gray-800 hover:text-white transition-all duration-300"
                    >
                      <span className="font-light">{category.buttonText}</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
