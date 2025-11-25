import { CollectionNav } from "@/components/store/category/collection-nav";
import { ProductGrid } from "@/components/store/category/product-grid";
import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { getSiteConfig } from "@/lib/site-config";
import { Collection, TypeProduct } from "@/types/product";

// Force le rendu dynamique côté serveur (pas de pré-rendu au build)
export const dynamic = "force-dynamic";
// Cache 5 minutes + revalidation en arrière-plan
export const revalidate = 300;

async function getCollections(): Promise<Collection[]> {
  // Récupérer les slugs des collections depuis menu_femme
  const menuFemmeConfig = await getSiteConfig("menu_femme");

  if (!menuFemmeConfig) {
    return [];
  }

  const menuItems: { id: string; collectionSlug: string }[] =
    JSON.parse(menuFemmeConfig);
  const slugs = menuItems.map((item) => item.collectionSlug);

  // Récupérer les collections correspondantes dans l'ordre du menu
  const collections = await prisma.collection.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
  });

  // Trier les collections dans l'ordre du menu
  const sortedCollections = slugs
    .map((slug) => collections.find((c) => c.slug === slug))
    .filter((c): c is Collection => c !== undefined);

  return sortedCollections;
}

async function getProducts(): Promise<TypeProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      collections: {
        some: {
          collection: {
            slug: "femmes",
          },
        },
      },
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
  // Sérialiser pour éviter les problèmes avec les dates
  return JSON.parse(JSON.stringify(products));
}

export default async function Page() {
  const products = await getProducts();
  const collections = await getCollections();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto sm:px-6">
        <CollectionNav
          collections={collections}
          basePath="/femme"
          title="Collections femme"
        />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
