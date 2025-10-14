"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useImageError } from "@/hooks/use-image-error";
import { TypeProduct } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  const [api, setApi] = useState<CarouselApi>();
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleImageError, isImageFailed } = useImageError();

  const collection = "nouveautes";

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/produits/collection/${collection}`);
        if (response.ok) {
          const featuredProducts = await response.json();
          setProducts(featuredProducts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getFeaturedProducts();
  }, [collection]);

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  if (isLoading) {
    return (
      <section className="py-6 bg-white">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 border border-black/20 text-black text-sm font-medium mb-6">
            NOUVEAUTÉS
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/5] bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 border border-black/20 text-black text-sm font-medium mb-6">
            NOUVEAUTÉS
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-wide">
            Nos dernières
            <span className="block font-medium">nouveautés</span>
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Aucun produit disponible pour le moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-16 pb-8 md:pb-16 bg-white">
      <div className="mb-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="inline-flex items-center px-4 py-2 border border-black/20 text-black text-sm font-medium mb-6">
            NOUVEAUTÉS
          </h2>
          {/* <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-wide">
            Nos dernières nouveautés
          </h2> */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Découvrez notre sélection exclusive des dernières tendances
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={scrollPrev}
              className="p-3 border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
              aria-label="Produit précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="p-3 border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
              aria-label="Produit suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-3 md:-ml-6">
            {products
              .filter((product: TypeProduct) => product.actif === true)
              .map((product: TypeProduct) => (
                <CarouselItem
                  key={product.id}
                  className="pl-3 md:pl-6 basis-1/2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <Link
                    href={`/produits/${product.slug}`}
                    className="block group"
                  >
                    <div className="relative">
                      {/* Product Image */}
                      <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-3 relative border border-gray-200 group-hover:border-black transition-colors duration-300">
                        {product.images &&
                        product.images.length > 0 &&
                        product.images[0] &&
                        !isImageFailed(product.images[0]) ? (
                          <Image
                            src={product.images[0]}
                            alt={product.nom}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={75}
                            onError={() => handleImageError(product.images[0])}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm font-light">
                              {product.images[0] &&
                              isImageFailed(product.images[0])
                                ? "Image non disponible"
                                : "Aucune image"}
                            </span>
                          </div>
                        )}
                        {/* Sale Badge */}
                        {product.prixReduit && product.prixReduit > 0 && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-black text-white px-3 py-1 text-xs font-medium">
                              PROMO
                            </span>
                          </div>
                        )}

                        {/* New Badge */}
                        {product.collections?.some(
                          (pc) =>
                            pc.collection.nom.toLowerCase() === "nouveautés"
                        ) && (
                          <div
                            className={`absolute top-4 z-10 ${
                              product.prixReduit && product.prixReduit > 0
                                ? "right-4"
                                : "left-4"
                            }`}
                          >
                            <span className="bg-green-600 text-white px-3 py-1 text-xs font-medium">
                              NOUVEAU
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="text-base font-medium text-black group-hover:text-gray-600 transition-colors duration-300">
                          {product.nom}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {product.prixReduit && product.prixReduit > 0 ? (
                            <>
                              <span className="text-lg font-bold text-black">
                                {product.prixReduit.toFixed(2)}€
                              </span>
                              <span className="text-sm text-gray-500 line-through font-light">
                                {product.prix.toFixed(2)}€
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-medium text-black">
                              {product.prix.toFixed(2)}€
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
