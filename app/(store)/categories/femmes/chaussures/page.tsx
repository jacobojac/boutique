import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { TypeProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

// Cache 5 minutes + revalidation en arrière-plan
export const revalidate = 300;

async function getProducts(): Promise<TypeProduct[]> {
  // Récupérer les produits de la collection actuelle
  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          collections: {
            some: {
              collection: {
                slug: "femmes",
              },
            },
          },
        },
        {
          collections: {
            some: {
              collection: {
                slug: "chaussures",
              },
            },
          },
        },
      ],
    },
    include: {
      variants: true,
      collections: {
        include: {
          collection: true,
        },
      },
    },
  });
  return products;
}

export default async function Page() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/*Titre de la collection actuelle */}
      <div className="mb-8">
        <h1 className="text-xl mb-2">Chaussures femme</h1>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products
          .filter((product) => product.actif === true)
          .map((product: TypeProduct) => (
            <div key={product.id} className="group cursor-pointer">
              <Link href={`/produits/${product.slug}`}>
                <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
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
                        (pc) => pc.collection.nom.toLowerCase() === "nouveautés"
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
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Aucune image</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                  {product.nom}
                </h3>
                <div className="flex items-center gap-2">
                  {product.prixReduit && product.prixReduit > 0 ? (
                    <>
                      <span className="text-lg font-semibold text-gray-900">
                        {product.prixReduit.toFixed(2)} €
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.prix.toFixed(2)} €
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-gray-900">
                      {product.prix.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Aucun produit trouvé dans cette catégorie.
          </p>
        </div>
      )}
    </div>
  );
}
