"use client";
import { DiscountReminder } from "@/components/store/product/discount-reminder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductVariant, TypeProduct } from "@/types/product";
import {
  IconHeadset,
  IconHeart,
  IconMinus,
  IconPlus,
  IconShield,
  IconShieldCheck,
  IconShoppingCart,
  IconTruck,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
    hasHydrated,
  } = useWishlistStore();

  const [product, setProduct] = useState<TypeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        // Simuler la récupération du produit par slug
        // Vous devrez créer une API route pour récupérer par slug
        const response = await fetch(`/api/produit/${slug}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
            setSelectedSize(productData.variants[0].taille || "");
            setSelectedColor(productData.variants[0].couleur || "");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getProduct();
    }
  }, [slug]);

  const handleVariantChange = (size: string, color: string) => {
    if (product?.variants) {
      const variant = product.variants.find(
        (v) => v.taille === size && v.couleur === color
      );
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

  const getUniqueValues = (key: "taille" | "couleur") => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v[key]).filter(Boolean))];
  };

  const getVariantPrice = () => {
    if (selectedVariant?.prix) {
      return selectedVariant.prix;
    }
    return product?.prix || 0;
  };

  const getMaxQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.quantity || 0;
    }
    return product?.quantity || 0;
  };

  const handleQuantityChange = (action: "increment" | "decrement") => {
    const maxQuantity = getMaxQuantity();

    if (action === "increment") {
      setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Produit retiré des favoris", {
        position: "top-center",
      });
    } else {
      addToWishlist(product);
      toast.success("Produit ajouté aux favoris", {
        position: "top-center",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Produit non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Carousel d'images */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/5] relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.nom} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        quality={90}
                      />

                      {/* Only show badges on the first image */}
                      {index === 0 && (
                        <>
                          {/* Sale Badge */}
                          {product.prixReduit && product.prixReduit > 0 && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-black text-white px-3 py-1 text-sm font-medium">
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
                              <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium">
                                NOUVEAU
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Miniatures */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <Image
                    src={image}
                    alt={`${product.nom} - Miniature ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              {/* En-tête avec titre et actions */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {product.nom}
                  </h1>
                </div>

                {/* Actions rapides */}
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className="hover:bg-red-50"
                  >
                    <IconHeart
                      className={`h-5 w-5 ${
                        product && hasHydrated && isInWishlist(product.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50"
                  >
                    <IconShare className="h-5 w-5 text-gray-600" />
                  </Button> */}
                </div>
              </div>

              {/* Collections/Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {product.collections.map((collection) => (
                  <Badge
                    key={collection.id}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {collection.collection.nom}
                  </Badge>
                ))}
              </div>

              {/* Prix */}
              <div>
                <div className="flex items-center space-x-4 mt-4">
                  {product.prixReduit && product.prixReduit > 0 ? (
                    <>
                      <span className="text-3xl">
                        {product.prixReduit.toFixed(2)}€
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {product.prix.toFixed(2)}€
                      </span>
                      <Badge variant="destructive" className="bg-red-500">
                        -
                        {Math.round(
                          ((product.prix - product.prixReduit) / product.prix) *
                            100
                        )}
                        %
                      </Badge>
                    </>
                  ) : (
                    <span className="text-3xl text-gray-900">
                      {getVariantPrice().toFixed(2)}€
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sélection des variantes */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {/* Taille */}
                {getUniqueValues("taille").length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Taille
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueValues("taille").map((taille) => (
                        <label key={taille} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="taille"
                            value={taille || ""}
                            checked={selectedSize === taille}
                            onChange={(e) => {
                              setSelectedSize(e.target.value);
                              handleVariantChange(
                                e.target.value,
                                selectedColor
                              );
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`px-3 py-2 border rounded-md text-sm font-medium transition-all ${
                              selectedSize === taille
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-black"
                            }`}
                          >
                            {taille}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Couleur */}
                {getUniqueValues("couleur").length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">
                      Couleur:{" "}
                      <span className="font-normal text-gray-900">
                        {selectedColor || "Sélectionnez"}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {getUniqueValues("couleur").map((couleur) => {
                        const variant = product.variants?.find(
                          (v) => v.couleur === couleur
                        );
                        const isSelected = selectedColor === couleur;
                        return (
                          <label
                            key={couleur}
                            className="relative cursor-pointer group"
                            title={couleur || undefined}
                          >
                            <input
                              type="radio"
                              name="couleur"
                              value={couleur || ""}
                              checked={isSelected}
                              onChange={(e) => {
                                setSelectedColor(e.target.value);
                                handleVariantChange(
                                  selectedSize,
                                  e.target.value
                                );
                              }}
                              className="sr-only"
                            />
                            <div className="relative">
                              {/* Outer ring pour sélection */}
                              <div
                                className={`w-10 h-10 rounded-full p-0.5 transition-all duration-200 ${
                                  isSelected
                                    ? "bg-black shadow-lg"
                                    : "bg-transparent group-hover:bg-gray-200"
                                }`}
                              >
                                {/* Color swatch */}
                                <div
                                  className="w-full h-full rounded-full border-2 border-white shadow-sm transition-all duration-200 group-hover:scale-105"
                                  style={{
                                    backgroundColor:
                                      variant?.couleurHex || "#ccc",
                                  }}
                                />
                              </div>

                              {/* Checkmark pour sélection */}
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                  </div>
                                </div>
                              )}

                              {/* Nom de la couleur en dessous */}
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <span
                                  className={`text-xs px-2 py-1 rounded-md transition-all ${
                                    isSelected
                                      ? "bg-black text-white"
                                      : "bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  {couleur}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantité et Actions */}
            <div className="space-y-6 mt-10">
              {/* Quantité */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Quantité
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                      className="h-8 w-8 rounded-r-none border-r border-gray-300"
                    >
                      <IconMinus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium px-3 py-1 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange("increment")}
                      className="h-8 w-8 rounded-l-none border-l border-gray-300"
                    >
                      <IconPlus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Stock */}
                  {selectedVariant && (
                    <div className="flex items-center">
                      {selectedVariant.quantity > 0 ? (
                        <div className="flex items-center text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium">
                            En stock ({selectedVariant.quantity} disponible
                            {selectedVariant.quantity > 1 ? "s" : ""})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium">
                            Rupture de stock
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton d'ajout au panier */}
              <Button
                className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                disabled={selectedVariant?.quantity === 0}
                onClick={() => {
                  if (product) {
                    const maxQuantity = getMaxQuantity();
                    addItem({
                      productId: product.id!,
                      nom: product.nom,
                      prix: product.prix,
                      prixReduit:
                        product.prixReduit && product.prixReduit > 0
                          ? product.prixReduit
                          : undefined,
                      quantite: quantity,
                      image: product.images[0] || "/images/placeholder.jpg",
                      taille: selectedSize,
                      couleur: selectedColor,
                      variantId: selectedVariant?.id,
                      maxQuantity: maxQuantity,
                    });
                    toast.success("Produit ajouté au panier", {
                      position: "top-center",
                    });
                  }
                }}
              >
                <IconShoppingCart className="h-6 w-6 mr-3" />
                Ajouter au panier
              </Button>
            </div>

            {/* Avantages produit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 rounded-lg bg-gray-50">
                <IconTruck className="h-6 w-6 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Livraison rapide
                  </p>
                  <p className="text-xs text-gray-600">Expédition sous 24h</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg bg-gray-50">
                <IconShieldCheck className="h-6 w-6 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Garantie qualité
                  </p>
                  <p className="text-xs text-gray-600">
                    Produit selectionné avec soin
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg bg-gray-50">
                <IconHeadset className="h-6 w-6 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Support client
                  </p>
                  <p className="text-xs text-gray-600">
                    Disponible 7j/7 par chat
                  </p>
                </div>
              </div>
            </div>
            {/* Description */}
            {product.description && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <IconShield className="h-5 w-5 mr-2 text-blue-600" />
                  Description du produit
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Section rappel des réductions */}
            <DiscountReminder />
          </div>
        </div>
      </div>
    </div>
  );
}
