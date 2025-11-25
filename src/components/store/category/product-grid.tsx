"use client";

import { TypeProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductGridProps {
  products: TypeProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const activeProducts = products.filter((product) => product.actif === true);

  if (activeProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aucun produit trouvé dans cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {activeProducts.map((product: TypeProduct) => (
        <div key={product.id} className="group cursor-pointer">
          <Link href={`/produits/${product.slug}`}>
            <div className="aspect-square overflow-hidden bg-gray-100 mb-4 relative">
              {product.images &&
              product.images.length > 0 &&
              product.images[0] ? (
                <>
                  <Image
                    src={product.images[0]}
                    alt={product.nom}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={75}
                  />

                  {/* Sale Badge */}
                  {product.prixReduit && product.prixReduit > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium">
                        PROMO
                      </span>
                    </div>
                  )}

                  {/* New Badge */}
                  {product.collections?.some(
                    (pc) => pc.collection.nom.toLowerCase() === "best sellers"
                  ) && (
                    <div
                      className={`absolute top-4 z-10 ${
                        product.prixReduit && product.prixReduit > 0
                          ? "right-4"
                          : "left-4"
                      }`}
                    >
                      <span className="bg-[#EA445A] text-white px-3 py-1 text-xs font-medium">
                        BEST SELLER
                      </span>
                    </div>
                  )}
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
  );
}
