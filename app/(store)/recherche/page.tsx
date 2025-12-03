"use client";

import { Button } from "@/components/ui/button";
import { TypeProduct } from "@/types/product";
import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/produits/recherche?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <IconSearch className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Rechercher des produits
            </h1>
            <p className="text-gray-600">
              Utilisez la barre de recherche pour trouver vos produits
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Résultats pour &quot;{query}&quot;
          </h1>
          <p className="text-gray-600">
            {products.length} produit{products.length > 1 ? "s" : ""} trouvé
            {products.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <IconSearch className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">
              Aucun résultat trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Essayez avec d&apos;autres mots-clés
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link href={`/produits/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100 mb-4 relative">
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <>
                        <Image
                          src={product.images[0]}
                          alt={product.nom}
                          fill
                          className="object-cover group-hover:scale-105 transition-all duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          quality={75}
                        />

                        {/* Sale Badge */}
                        {product.prixReduit && product.prixReduit > 0 ? (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-gray-700 text-white px-3 py-1 text-xs font-medium">
                              PROMO
                            </span>
                          </div>
                        ) : null}

                        {/* Best Seller Badge */}
                        {product.collections?.some(
                          (pc) => pc.collection.nom.toLowerCase() === "best sellers"
                        ) ? (
                          <div
                            className={`absolute top-4 z-10 ${
                              product.prixReduit && product.prixReduit > 0
                                ? "right-4"
                                : "left-4"
                            }`}
                          >
                            <span className="bg-black text-white px-3 py-1 text-xs font-medium">
                              BEST SELLER
                            </span>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">Aucune image</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="space-y-2">
                  <Link href={`/produits/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {product.nom}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    {product.prixReduit && product.prixReduit > 0 ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          {product.prixReduit.toFixed(2)} €
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {product.prix.toFixed(2)} €
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {product.prix.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Chargement...</div>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
