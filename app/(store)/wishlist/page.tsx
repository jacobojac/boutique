"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore, WishlistItem } from "@/store/wishlist-store";
import { IconHeart, IconTrash, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, hasHydrated } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const [displayItems, setDisplayItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (hasHydrated) {
      setDisplayItems(items);
    }
  }, [hasHydrated, items]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
    toast.success("Produit retiré de la wishlist");
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      nom: item.nom,
      prix: item.prix,
      prixReduit: item.prixReduit,
      quantite: 1,
      image: item.image,
      taille: "",
      couleur: "",
    });
    toast.success("Produit ajouté au panier");
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success("Wishlist vidée");
  };

  if (!hasHydrated || displayItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-8">
              <IconHeart className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Votre liste de favoris est vide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez nos produits et ajoutez-les à votre wishlist
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Retour à la page d&#39;accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes favoris
            </h1>
            <p className="text-gray-600">
              {displayItems.length} produit{displayItems.length > 1 ? "s" : ""}{" "}
              sauvegardé{displayItems.length > 1 ? "s" : ""}
            </p>
          </div>

          {displayItems.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="mt-4 sm:mt-0 rounded-full"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Vider tous les favoris
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.nom}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <IconX className="h-4 w-4 text-gray-600" />
                </button>

                {/* Sale badge */}
                {item.prixReduit && item.prixReduit > 0 ? (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gray-700 text-white px-3 py-1 text-xs font-medium">
                      PROMO
                    </span>
                  </div>
                ) : null}

                {/* Best Seller Badge */}
                {item.collections?.some(
                  (collection) => collection.toLowerCase() === "best sellers"
                ) ? (
                  <div
                    className={`absolute top-4 z-10 ${
                      item.prixReduit && item.prixReduit > 0
                        ? "right-4"
                        : "left-4"
                    }`}
                  >
                    <span className="bg-black text-white px-3 py-1 text-xs font-medium">
                      BEST SELLER
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Content */}
              <div className="p-4">
                <Link href={`/produits/${item.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {item.nom}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  {item.prixReduit ? (
                    <>
                      <span className="text-lg font-bold">
                        {item.prixReduit.toFixed(2)}€
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {item.prix.toFixed(2)}€
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {item.prix.toFixed(2)}€
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full"
                    size="sm"
                  >
                    Ajouter au panier
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="px-3 rounded-full"
                  >
                    <IconHeart className="h-4 w-4 text-[#EA445A] fill-current" />
                  </Button>
                </div>

                {/* Added date */}
                <p className="text-xs text-gray-400 mt-2">
                  Ajouté le {new Date(item.addedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
