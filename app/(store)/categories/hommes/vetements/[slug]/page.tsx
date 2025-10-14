import { Button } from "@/components/ui/button";
import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { Collection, TypeProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

//export async function generateStaticParams() {}
export default async function Page(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const params = await props.params;

  // Récupérer toutes les collections pour la navigation
  const collections = await prisma.collection.findMany({
    orderBy: {
      nom: "asc",
    },
  });

  // Récupérer les produits de la collection actuelle
  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          collections: {
            some: {
              collection: {
                slug: params.slug,
              },
            },
          },
        },
        {
          collections: {
            some: {
              collection: {
                slug: "hommes",
              },
            },
          },
        },
        {
          collections: {
            none: {
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

  // Récupérer les informations de la collection actuelle
  const currentCollection = await prisma.collection.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation des collections */}
      <div className="mb-8">
        <span className="text-lg font-medium mb-4">Collections homme</span>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/categories/hommes/vetements">
            <Button variant="outline" className="cursor-pointer">
              Tout
            </Button>
          </Link>
          {collections
            .filter(
              (collection: Collection) =>
                collection.slug != "chaussures" &&
                collection.slug != "hommes" &&
                collection.slug != "femmes" &&
                collection.slug != "nouveautes" &&
                collection.slug != "accessoires"
            )
            .map((collection: Collection) => (
              <Link
                key={collection.id}
                href={`/categories/hommes/vetements/${collection.slug}`}
              >
                <Button
                  variant={
                    collection.slug === params.slug ? "default" : "outline"
                  }
                  className={`transition-all duration-200 cursor-pointer ${
                    collection.slug === params.slug
                      ? "bg-black text-white hover:bg-gray-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {collection.nom}
                </Button>
              </Link>
            ))}
          <Link href="/categories/hommes/vetements/accessoires">
            <Button
              variant={params.slug === "accessoires" ? "default" : "outline"}
              className={`transition-all duration-200 cursor-pointer ${
                params.slug === "accessoires"
                  ? "bg-black text-white hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }`}
            >
              Accessoires
            </Button>
          </Link>
          <Link href="/categories/hommes/vetements/nouveautes">
            <Button
              variant={params.slug === "nouveautes" ? "default" : "outline"}
              className={`transition-all duration-200 cursor-pointer ${
                params.slug === "nouveautes"
                  ? "bg-black text-white hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }`}
            >
              Nouveautés
            </Button>
          </Link>
        </div>
      </div>

      {/* Titre de la collection actuelle */}
      <div className="mb-8">
        <h1 className="text-xl mb-2">
          {currentCollection?.nom || params.slug.replace("-", " ")}
        </h1>
        {currentCollection?.description && (
          <p className="text-gray-600 text-lg">
            {currentCollection.description}
          </p>
        )}
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
