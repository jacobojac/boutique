"use client";

import { Button } from "@/components/ui/button";
import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import { ArrowRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Category = {
  title: string;
  subtitle: string;
  image: StaticImageData | string;
  link: string;
  buttonText: string;
  featured?: boolean;
};

export default function CategoriesSection() {
  const { config, isLoading } = useHomePageConfig();

  const categories = useMemo<Category[]>(() => {
    const newCategories: Category[] = [];

    // Build categories from config
    const categoryData = [
      {
        title: config.category_1_name,
        subtitle: config.category_1_subtitle,
        buttonText: config.category_1_button_text,
        link: config.category_1_link,
        image: config.category_1_image,
      },
      {
        title: config.category_2_name,
        subtitle: config.category_2_subtitle,
        buttonText: config.category_2_button_text,
        link: config.category_2_link,
        image: config.category_2_image,
      },
      {
        title: config.category_3_name,
        subtitle: config.category_3_subtitle,
        buttonText: config.category_3_button_text,
        link: config.category_3_link,
        image: config.category_3_image,
      },
      {
        title: config.category_4_name,
        subtitle: config.category_4_subtitle,
        buttonText: config.category_4_button_text,
        link: config.category_4_link,
        image: config.category_4_image,
      },
    ];

    categoryData.forEach((category, index) => {
      if (category.title) {
        newCategories.push({
          title: category.title,
          subtitle: category.subtitle || "",
          buttonText: category.buttonText || "Explorer",
          link: category.link || "",
          image: category.image || "",
          featured: index === 0, // First category is featured
        });
      }
    });

    return newCategories;
  }, [config]);

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="text-center mb-16">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="inline-flex items-center px-4 py-2 border border-black/20 text-black text-sm font-medium mb-6">
            COLLECTIONS
          </h2>
          {/* <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-wide">
            {config.title}
          </h2> */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            {config.categories_section_description}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/${category.link}`}
              className="group block"
            >
              <div className="relative overflow-hidden bg-white border border-gray-200 hover:border-black transition-all duration-300">
                {/* Featured Badge */}
                {category.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-black text-white px-3 py-1 text-xs font-medium">
                      POPULAIRE
                    </div>
                  </div>
                )}

                {/* Image Container */}
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

                {/* Content */}
                <div className="p-6 bg-white transition-colors duration-300">
                  <h3 className="text-lg font-medium text-black mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 font-light">
                    {category.subtitle}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-black hover:bg-black hover:text-white hover:px-4 transition-all duration-300 px-0"
                  >
                    <span>{category.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
