import CategoriesSection from "@/components/store/home/categories-section";
import CustomerExperience from "@/components/store/home/customer-experience";
import FeaturedProducts from "@/components/store/home/featured-products";
import Hero from "@/components/store/home/hero";
import ImageCarousel from "@/components/store/home/image-carousel";
import PromoSection from "@/components/store/home/promo-section";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoSection />
      <ImageCarousel />
      <CustomerExperience />
    </>
  );
}
