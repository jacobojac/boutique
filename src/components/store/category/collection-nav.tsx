"use client";

import { Button } from "@/components/ui/button";
import { Collection } from "@/types/product";
import Link from "next/link";

interface CollectionNavProps {
  collections: Collection[];
  basePath: string;
  title: string;
  currentSlug?: string;
}

export function CollectionNav({
  collections,
  basePath,
  title,
  currentSlug,
}: CollectionNavProps) {
  const isAllSelected = !currentSlug;

  return (
    <div className="mb-8">
      <span className="text-lg font-medium mb-4">{title}</span>
      <div className="flex flex-wrap gap-2 mt-4">
        <Link href={basePath}>
          <Button
            variant={isAllSelected ? "default" : "outline"}
            className={`cursor-pointer ${
              isAllSelected ? "bg-black text-white hover:bg-gray-800" : ""
            }`}
          >
            Tout
          </Button>
        </Link>
        {collections.map((collection: Collection) => (
          <Link key={collection.id} href={`${basePath}/${collection.slug}`}>
            <Button
              variant={collection.slug === currentSlug ? "default" : "outline"}
              className={`transition-all duration-200 cursor-pointer ${
                collection.slug === currentSlug
                  ? "bg-black text-white hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {collection.nom}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
