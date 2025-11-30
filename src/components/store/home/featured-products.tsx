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

  const collection = "best-sellers";

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

  return (
    <section id="featured-products" className="py-20 bg-white">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <div className="bg-black w-full py-6 mb-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-widest text-white">
            BEST SELLERS
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Products Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent className="-ml-3 md:-ml-5">
              {products
                .filter((product: TypeProduct) => product.actif === true)
                .map((product: TypeProduct) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-3 md:pl-5 basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      href={`/produits/${product.slug}`}
                      className="block group"
                    >
                      <div className="relative">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden bg-white mb-4 relative transition-all duration-500">
                          {product.images &&
                          product.images.length > 0 &&
                          product.images[0] &&
                          !isImageFailed(product.images[0]) ? (
                            <div>
                              {/* Main Image */}
                              <Image
                                src={product.images[0]}
                                alt={product.nom}
                                fill
                                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                quality={75}
                                onError={() =>
                                  handleImageError(product.images[0])
                                }
                              />
                              {/* Second Image on Hover */}
                              {product.images[1] &&
                              !isImageFailed(product.images[1]) ? (
                                <Image
                                  src={product.images[1]}
                                  alt={product.nom}
                                  fill
                                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  quality={75}
                                  onError={() =>
                                    handleImageError(product.images[1])
                                  }
                                />
                              ) : null}
                            </div>
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
                          {product.prixReduit && product.prixReduit > 0 ? (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-black text-white px-2.5 py-1 text-[10px] font-light tracking-wider">
                                PROMO
                              </span>
                            </div>
                          ) : null}

                          {/* New Badge */}
                          {product.collections?.some(
                            (pc) =>
                              pc.collection.nom.toLowerCase() === "nouveautés"
                          ) ? (
                            <div
                              className={`absolute top-4 z-10 ${
                                product.prixReduit && product.prixReduit > 0
                                  ? "right-4"
                                  : "left-4"
                              }`}
                            >
                              <span className="bg-black text-white px-2.5 py-1 text-[10px] font-light tracking-wider">
                                NOUVEAU
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                          {/* Category */}
                          {product.collections?.some(
                            (pc) => pc.collection.nom.toLowerCase() === "femmes"
                          ) ? (
                            <span className="text-[9px] font-light text-gray-500 tracking-widest uppercase">
                              FEMME
                            </span>
                          ) : product.collections?.some(
                              (pc) =>
                                pc.collection.nom.toLowerCase() === "hommes"
                            ) ? (
                            <span className="text-[9px] font-light text-gray-500 tracking-widest uppercase">
                              HOMME
                            </span>
                          ) : null}
                          <h3 className="text-xs font-light text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 tracking-wide">
                            {product.nom}
                          </h3>
                          <div className="flex items-center gap-2">
                            {product.prixReduit && product.prixReduit > 0 ? (
                              <>
                                <span className="text-sm font-normal text-black">
                                  {product.prixReduit.toFixed(2)}€
                                </span>
                                <span className="text-xs text-gray-400 line-through font-light">
                                  {product.prix.toFixed(2)}€
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-normal text-black">
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

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              type="button"
              onClick={scrollPrev}
              className="w-11 h-11 flex items-center justify-center border border-gray-300 hover:border-black transition-all duration-300"
              aria-label="Produit précédent"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="w-11 h-11 flex items-center justify-center border border-gray-300 hover:border-black transition-all duration-300"
              aria-label="Produit suivant"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
