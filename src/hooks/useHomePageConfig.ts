"use client";

import { Discount } from "@/types/order";
import { useCallback, useEffect, useState } from "react";

interface HomePageConfig {
  // Hero Section
  homepage_hero_image: string;
  homepage_hero_title: string;
  homepage_hero_subtitle: string;
  homepage_hero_button_text: string;

  // Announcement
  announcement_message: string;
  announcement_message_2: string;

  // Categories
  category_homme_image: string;
  category_femme_image: string;

  // Video/Promo Section
  promo_section_title: string;
  promo_section_description: string;

  // Discount Configuration
  promo_section_image: string;
  promo_discount_enabled: boolean;
  promo_discount_text: string;
  selected_discount_id: string;
  selectedDiscount: Discount | null;
}

const defaultConfig: HomePageConfig = {
  // Hero Section
  homepage_hero_image: "",
  homepage_hero_title: "",
  homepage_hero_subtitle: "",
  homepage_hero_button_text: "",

  // Announcement
  announcement_message: "",
  announcement_message_2: "",

  // Categories
  category_homme_image: "",
  category_femme_image: "",

  // Video/Promo Section
  promo_section_title: "",
  promo_section_description: "",

  // Discount Configuration
  promo_section_image: "",
  promo_discount_enabled: false,
  promo_discount_text: "",
  selected_discount_id: "",
  selectedDiscount: null,
};

export function useHomePageConfig() {
  const [config, setConfig] = useState<HomePageConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load site configurations
      const configResponse = await fetch("/api/site-config");
      if (!configResponse.ok) {
        throw new Error("Failed to load site configuration");
      }

      const configs = await configResponse.json();
      const configMap: Record<string, string> = {};
      configs.forEach((c: { key: string; value: string }) => {
        configMap[c.key] = c.value;
      });

      // Load discounts if discount is enabled
      let selectedDiscount: Discount | null = null;
      if (
        configMap["selected_discount_id"] &&
        configMap["promo_discount_enabled"] === "true"
      ) {
        try {
          const discountResponse = await fetch("/api/discounts");
          if (discountResponse.ok) {
            const discounts = await discountResponse.json();
            selectedDiscount =
              discounts.find(
                (d: Discount) => d.id === configMap["selected_discount_id"]
              ) || null;
          }
        } catch (discountError) {
          console.error("Error loading discount:", discountError);
          // Continue without discount data rather than failing entirely
        }
      }

      // Update config with loaded values
      setConfig({
        // Hero Section
        homepage_hero_image:
          configMap["homepage_hero_image"] || defaultConfig.homepage_hero_image,
        homepage_hero_title:
          configMap["homepage_hero_title"] || defaultConfig.homepage_hero_title,
        homepage_hero_subtitle:
          configMap["homepage_hero_subtitle"] ||
          defaultConfig.homepage_hero_subtitle,
        homepage_hero_button_text:
          configMap["homepage_hero_button_text"] ||
          defaultConfig.homepage_hero_button_text,

        // Announcement
        announcement_message:
          configMap["announcement_message"] ||
          defaultConfig.announcement_message,
        announcement_message_2:
          configMap["announcement_message_2"] ||
          defaultConfig.announcement_message_2,

        // Categories
        category_homme_image:
          configMap["category_homme_image"] || defaultConfig.category_homme_image,
        category_femme_image:
          configMap["category_femme_image"] || defaultConfig.category_femme_image,

        // Video/Promo Section
        promo_section_title:
          configMap["promo_section_title"] || defaultConfig.promo_section_title,
        promo_section_description:
          configMap["promo_section_description"] ||
          defaultConfig.promo_section_description,

        // Discount Configuration
        promo_section_image:
          configMap["promo_section_image"] || defaultConfig.promo_section_image,
        promo_discount_enabled: configMap["promo_discount_enabled"] === "true",
        promo_discount_text:
          configMap["promo_discount_text"] || defaultConfig.promo_discount_text,
        selected_discount_id:
          configMap["selected_discount_id"] ||
          defaultConfig.selected_discount_id,
        selectedDiscount,
      });
    } catch (err) {
      console.error("Error loading home page configuration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load configuration"
      );
      // Use default config on error
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshConfig = useCallback(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    isLoading,
    error,
    refreshConfig,
  };
}
