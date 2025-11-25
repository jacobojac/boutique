import { CollectionNav } from "@/components/store/category/collection-nav";
import { ProductGrid } from "@/components/store/category/product-grid";
import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { getSiteConfig } from "@/lib/site-config";
import { Collection, TypeProduct } from "@/types/product";

// Force le rendu dynamique côté serveur (pas de pré-rendu au build)
export const dynamic = "force-dynamic";

async function getCollections(): Promise<Collection[]> {
  // Récupérer les slugs des collections depuis menu_homme
  const menuHommeConfig = await getSiteConfig("menu_homme");

  if (!menuHommeConfig) {
    return [];
  }

  const menuItems: { id: string; collectionSlug: string }[] =
    JSON.parse(menuHommeConfig);
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

async function getProducts(slug: string): Promise<TypeProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          collections: {
            some: {
              collection: {
                slug: slug,
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
  // Sérialiser pour éviter les problèmes avec les dates
  return JSON.parse(JSON.stringify(products));
}

export default async function Page(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const params = await props.params;
  const collections = await getCollections();
  const products = await getProducts(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto sm:px-6">
        <CollectionNav
          collections={collections}
          basePath="/homme"
          title="Collections homme"
          currentSlug={params.slug}
        />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
