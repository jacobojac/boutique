import CategoriesSection from "@/components/store/home/categories-section";
import CustomerExperience from "@/components/store/home/customer-experience";
import FeaturedProducts from "@/components/store/home/featured-products";
import Hero from "@/components/store/home/hero";
import PromoSection from "@/components/store/home/promo-section";
import Video from "@/components/store/home/video";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <CustomerExperience />

      <CategoriesSection />

      <FeaturedProducts />
      <PromoSection />
      <Video />
    </main>
  );
}
