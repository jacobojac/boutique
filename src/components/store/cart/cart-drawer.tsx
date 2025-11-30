"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { Discount } from "@/types/order";
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingBag,
  IconTag,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CartDrawer = () => {
  const router = useRouter();

  // États pour la gestion des réductions
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [activeDiscounts, setActiveDiscounts] = useState<Discount[]>([]);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const {
    items,
    isOpen,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
    getTotalPrice,
    getTotalItems,
    hasHydrated,
  } = useCartStore();

  const handleQuantityChange = (
    id: string,
    action: "increment" | "decrement"
  ) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const maxQty = item.maxQuantity || Infinity;
    const newQuantity =
      action === "increment"
        ? Math.min(item.quantite + 1, maxQty)
        : item.quantite - 1;

    updateQuantity(id, newQuantity);

    // Recalculer la réduction si une réduction est appliquée
    if (appliedDiscount) {
      const newDiscountAmount = calculateDiscountAmount(appliedDiscount);
      setDiscountAmount(newDiscountAmount);
    }
  };

  // Charger les réductions actives au montage du composant
  useEffect(() => {
    const loadActiveDiscounts = async () => {
      try {
        const response = await fetch("/api/discounts");
        if (response.ok) {
          const allDiscounts: Discount[] = await response.json();
          const now = new Date();

          // Filtrer les réductions actives et non expirées
          const activeDiscounts = allDiscounts.filter((discount) => {
            if (!discount.isActive) return false;

            // Vérifier la date d'expiration
            if (discount.expiresAt && new Date(discount.expiresAt) < now) {
              return false;
            }

            // Vérifier la date de début
            if (discount.startsAt && new Date(discount.startsAt) > now) {
              return false;
            }

            // Vérifier le nombre d'utilisations maximum
            if (discount.maxUses && discount.usedCount >= discount.maxUses) {
              return false;
            }

            return true;
          });

          setActiveDiscounts(activeDiscounts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réductions:", error);
      }
    };

    loadActiveDiscounts();
  }, []);

  // Calculer le montant de la réduction
  const calculateDiscountAmount = (discount: Discount) => {
    const subtotal = getTotalPrice();

    // Vérifier le montant minimum
    if (discount.minAmount && subtotal < discount.minAmount) {
      return 0;
    }

    let discountAmount = 0;

    if (discount.type === "PERCENTAGE") {
      discountAmount = (subtotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    // La réduction ne peut pas être supérieure au montant total
    discountAmount = Math.min(discountAmount, subtotal);

    return discountAmount;
  };

  // Appliquer le code de réduction
  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast.error("Veuillez saisir un code de réduction", {
        position: "top-center",
      });
      return;
    }

    setIsApplyingDiscount(true);

    try {
      // Chercher le code dans les réductions actives
      const discount = activeDiscounts.find(
        (d) => d.code.toUpperCase() === discountCode.toUpperCase()
      );

      if (!discount) {
        toast.error("Code de réduction invalide ou expiré", {
          position: "top-center",
        });
        return;
      }

      const subtotal = getTotalPrice();

      // Vérifier le montant minimum
      if (discount.minAmount && subtotal < discount.minAmount) {
        toast.error(
          `Montant minimum de ${discount.minAmount.toFixed(
            2
          )}€ requis pour cette réduction`,
          {
            position: "top-center",
          }
        );
        return;
      }

      const calculatedDiscount = calculateDiscountAmount(discount);

      if (calculatedDiscount > 0) {
        setAppliedDiscount(discount);
        setDiscountAmount(calculatedDiscount);
        toast.success(`Code de réduction "${discount.code}" appliqué !`, {
          position: "top-center",
        });
      } else {
        toast.error(
          "Cette réduction ne peut pas être appliquée à votre commande",
          {
            position: "top-center",
          }
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'application de la réduction:", error);
      toast.error("Erreur lors de l'application de la réduction", {
        position: "top-center",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // Supprimer la réduction appliquée
  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode("");
    toast.success("Code de réduction supprimé", {
      position: "top-center",
    });
  };

  // Calculer le prix total avec réduction
  const getFinalTotalPrice = () => {
    return getTotalPrice() - discountAmount;
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
      direction="right"
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full hover:bg-transparent cursor-pointer h-8 w-8 flex items-center justify-center p-0"
          size="icon"
          onClick={openCart}
        >
          <IconShoppingBag className="h-7 w-7" stroke={1} />
          {hasHydrated && getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalItems() > 9 ? "9+" : getTotalItems()}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-full sm:max-w-md sm:ml-auto right-0 top-0 bottom-0 fixed z-50 sm:rounded-l-lg data-[vaul-drawer-direction=right]:w-full sm:data-[vaul-drawer-direction=right]:w-auto">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>
                Panier ({hasHydrated ? getTotalItems() : 0})
              </DrawerTitle>
              <DrawerDescription>
                Gérez vos articles avant de passer commande
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <IconX className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <IconShoppingBag className="h-16 w-16 mb-4" />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-sm">
                  <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.nom}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.nom}</h3>
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      {item.taille && <p>Taille: {item.taille}</p>}
                      {item.couleur && <p>Couleur: {item.couleur}</p>}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {item.prixReduit && item.prixReduit > 0 ? (
                        <>
                          <span className="font-bold text-sm text-black">
                            {item.prixReduit.toFixed(2)}€
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {item.prix.toFixed(2)}€
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-sm text-black">
                          {item.prix.toFixed(2)}€
                        </span>
                      )}
                    </div>

                    {/* Quantité sur mobile - en dessous du prix */}
                    <div className="flex items-center justify-between mt-2 sm:hidden">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleQuantityChange(item.id, "decrement")
                          }
                          disabled={item.quantite <= 1}
                        >
                          <IconMinus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium px-2">
                          {item.quantite}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleQuantityChange(item.id, "increment")
                          }
                          disabled={
                            item.maxQuantity
                              ? item.quantite >= item.maxQuantity
                              : false
                          }
                        >
                          <IconPlus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quantité et suppression sur desktop - à droite */}
                  <div className="hidden sm:flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleQuantityChange(item.id, "decrement")
                        }
                        disabled={item.quantite <= 1}
                      >
                        <IconMinus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium px-2">
                        {item.quantite}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleQuantityChange(item.id, "increment")
                        }
                        disabled={
                          item.maxQuantity
                            ? item.quantite >= item.maxQuantity
                            : false
                        }
                      >
                        <IconPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Section Code de réduction - Affichée seulement s'il y a des réductions actives */}
            {activeDiscounts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconTag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Code de réduction
                  </span>
                </div>

                {appliedDiscount ? (
                  // Affichage de la réduction appliquée
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <IconCheck className="h-4 w-4 text-green-600" />
                      <div>
                        <span className="text-sm font-medium text-green-800">
                          {appliedDiscount.code}
                        </span>
                        <p className="text-xs text-green-600">
                          {appliedDiscount.type === "PERCENTAGE"
                            ? `${appliedDiscount.value}% de réduction`
                            : `${appliedDiscount.value.toFixed(
                                2
                              )}€ de réduction`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeDiscount}
                      className="text-green-600 hover:text-green-800"
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  // Champ de saisie du code de réduction
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Code de réduction"
                        value={discountCode}
                        onChange={(e) =>
                          setDiscountCode(e.target.value.toUpperCase())
                        }
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            applyDiscountCode();
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={applyDiscountCode}
                        disabled={isApplyingDiscount || !discountCode.trim()}
                        className="px-4"
                      >
                        {isApplyingDiscount ? "..." : "Appliquer"}
                      </Button>
                    </div>

                    {/* Message d'erreur pour montant minimum */}
                    {discountCode &&
                      (() => {
                        const discount = activeDiscounts.find(
                          (d) =>
                            d.code.toUpperCase() === discountCode.toUpperCase()
                        );
                        const currentTotal = getTotalPrice();

                        if (
                          discount &&
                          discount.minAmount &&
                          currentTotal < discount.minAmount
                        ) {
                          return (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                              <p>
                                Montant minimum de{" "}
                                <span className="font-medium">
                                  {discount.minAmount.toFixed(2)}€
                                </span>{" "}
                                requis pour ce code de réduction.
                              </p>
                              <p className="text-xs text-red-500 mt-1">
                                Montant actuel: {currentTotal.toFixed(2)}€ (il
                                manque{" "}
                                {(discount.minAmount - currentTotal).toFixed(2)}
                                €)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                  </div>
                )}
              </div>
            )}

            {/* Calcul du total */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base">Sous-total:</span>
                <span className="text-base">{getTotalPrice().toFixed(2)}€</span>
              </div>

              {appliedDiscount && discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-base">
                    Réduction ({appliedDiscount.code}):
                  </span>
                  <span className="text-base">
                    -{discountAmount.toFixed(2)}€
                  </span>
                </div>
              )}

              <div className="border-t pt-2">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>{getFinalTotalPrice().toFixed(2)}€</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full cursor-pointer"
                size="lg"
                onClick={() => {
                  // TODO: Passer les informations de réduction à la page de confirmation
                  // Stocker les informations de la réduction pour la commande
                  if (appliedDiscount) {
                    localStorage.setItem(
                      "appliedDiscount",
                      JSON.stringify({
                        discountId: appliedDiscount.id,
                        discountCode: appliedDiscount.code,
                        discountType: appliedDiscount.type,
                        discountValue: appliedDiscount.value,
                        discountAmount: discountAmount,
                      })
                    );
                  }

                  router.push("/commande/confirmation");
                  closeCart();
                }}
              >
                Passer commande
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={closeCart}
              >
                Continuer mes achats
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};
