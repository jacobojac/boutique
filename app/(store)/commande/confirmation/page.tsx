"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrder } from "@/hooks/use-order";
import { useCartStore } from "@/store/cart-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandWhatsapp,
  IconCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schéma de validation pour le formulaire client
const customerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(10, "Le téléphone doit contenir au moins 10 chiffres"),
  street: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  city: z.string().min(2, "La ville est requise"),
  country: z.enum(["France", "Belgique"]),
  deliveryMethod: z
    .enum([
      "hand-delivery-aulnay",
      "hand-delivery-idf",
      "parcel-france-relais",
      "parcel-france-home",
    ])
    .optional(),
});

// Composant qui contient la logique utilisant useSearchParams
function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder, isLoading: orderLoading } = useOrder();

  const [isMounted, setIsMounted] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    discountId: string;
    discountCode: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  // Formulaire avec react-hook-form et zod
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      street: "",
      postalCode: "",
      city: "",
      country: "France",
      deliveryMethod: undefined,
    },
  });

  // Générer le numéro de commande une seule fois
  const orderNumber = useMemo(() => {
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `CMD-${timestamp}-${random}`;
    };

    return searchParams.get("order") || generateOrderNumber();
  }, [searchParams]);

  // Marquer comme monté côté client et récupérer la réduction appliquée
  useEffect(() => {
    setIsMounted(true);

    // Récupérer les informations de réduction depuis localStorage
    const storedDiscount = localStorage.getItem("appliedDiscount");
    if (storedDiscount) {
      try {
        const discountInfo = JSON.parse(storedDiscount);
        setAppliedDiscount(discountInfo);
      } catch (error) {
        console.error(
          "Erreur lors du parsing des informations de réduction:",
          error
        );
      }
    }
  }, []);

  // Vider le panier seulement lors de la sortie de la page (pas au rechargement)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Vider le panier seulement si la commande a été confirmée
      if (orderConfirmed) {
        clearCart();
      }
    };

    const handlePopstate = () => {
      // Vider le panier lors de la navigation arrière si commande confirmée
      if (orderConfirmed) {
        clearCart();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
      // Vider le panier lors du démontage du composant si commande confirmée
      if (orderConfirmed) {
        clearCart();
      }
    };
  }, [orderConfirmed, clearCart]);

  // Ne pas vider le panier automatiquement - attendre la sauvegarde réussie

  // Calculer les frais de livraison
  const getDeliveryFee = () => {
    const deliveryMethod = form.watch("deliveryMethod");
    if (deliveryMethod === "parcel-france-relais") {
      return 5.0;
    } else if (deliveryMethod === "parcel-france-home") {
      return 8.9;
    }
    return 0;
  };

  // Calculer le total final avec réduction et frais de livraison
  const getFinalTotalPrice = () => {
    const subtotal = getTotalPrice();
    const deliveryFee = getDeliveryFee();
    let total = subtotal + deliveryFee;

    if (appliedDiscount) {
      total = total - appliedDiscount.discountAmount;
    }
    return total;
  };

  // Fonction de soumission du formulaire
  const onSubmitCustomerInfo = async () => {
    setFormCompleted(true);
  };

  const formatOrderMessage = useCallback(() => {
    const itemsList = items
      .map(
        (item) =>
          `• ${item.nom}${item.taille ? ` (Taille: ${item.taille})` : ""}${
            item.couleur ? ` (Couleur: ${item.couleur})` : ""
          } x${item.quantite} - ${(item.prix * item.quantite).toFixed(2)}€`
      )
      .join("\n");

    const formValues = form.getValues();
    const customerName = `${formValues.firstName} ${formValues.lastName}`;
    const fullAddress = `${formValues.street}\n${formValues.postalCode} ${formValues.city}\n${formValues.country}`;

    // Formater le mode de livraison
    let deliveryMethodText = "";
    if (formValues.deliveryMethod === "hand-delivery-aulnay") {
      deliveryMethodText =
        "Remise en main propre gratuite sur Aulnay-sous-Bois";
    } else if (formValues.deliveryMethod === "hand-delivery-idf") {
      deliveryMethodText = "Livraison de main à main en Île-de-France";
    } else if (formValues.deliveryMethod === "parcel-france-relais") {
      deliveryMethodText = "Envoi en point relais";
    } else if (formValues.deliveryMethod === "parcel-france-home") {
      deliveryMethodText = "Envoi à domicile";
    }

    const subtotal = getTotalPrice();
    const deliveryFee = getDeliveryFee();
    const finalTotal = getFinalTotalPrice();

    let message =
      `*Nouvelle Commande*\n\n` +
      `*Numéro: ${orderNumber}*\n\n` +
      `*Client:* ${customerName}\n` +
      `*Téléphone:* ${formValues.phone}\n` +
      `*Adresse:*\n${fullAddress}\n\n` +
      `*Articles commandés:*\n${itemsList}\n\n` +
      `*Sous-total:* ${subtotal.toFixed(2)}€\n`;

    if (deliveryFee > 0) {
      message += `*Frais de livraison:* ${deliveryFee.toFixed(2)}€\n`;
    }

    if (appliedDiscount) {
      message += `*Réduction (${
        appliedDiscount.discountCode
      }):* -${appliedDiscount.discountAmount.toFixed(2)}€\n`;
    }

    message += `*Total:* ${finalTotal.toFixed(2)}€\n`;

    if (deliveryMethodText) {
      message += `\n*Mode de livraison:* ${deliveryMethodText}\n`;
    }

    return message;
  }, [
    items,
    orderNumber,
    getTotalPrice,
    getFinalTotalPrice,
    appliedDiscount,
    form,
  ]);

  const handleWhatsAppClick = async () => {
    if (!formCompleted) {
      toast.error("Veuillez d'abord remplir vos informations de livraison", {
        position: "top-center",
      });
      return;
    }

    setIsSavingOrder(true);

    try {
      const formValues = form.getValues();
      const customerName = `${formValues.firstName} ${formValues.lastName}`;

      // Sauvegarder la commande avec les informations client
      const result = await createOrder(
        orderNumber,
        items,
        getFinalTotalPrice(),
        {
          name: customerName,
          phone: formValues.phone,
          street: formValues.street,
          postalCode: formValues.postalCode,
          city: formValues.city,
          country: formValues.country,
          deliveryMethod: formValues.deliveryMethod,
        }
      );

      if (result) {
        // Marquer la commande comme confirmée
        setOrderConfirmed(true);

        // Nettoyer les informations de réduction
        localStorage.removeItem("appliedDiscount");

        toast.success(
          "Commande sauvegardée avec succès ! Ouverture de WhatsApp...",
          {
            position: "top-center",
          }
        );

        // Générer le message AVANT de vider le panier
        const message = encodeURIComponent(formatOrderMessage());

        // Générer le message et ouvrir WhatsApp
        const phoneNumber = "+33759387212";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        // Attendre un peu pour que l'utilisateur voie le toast puis ouvrir WhatsApp
        setTimeout(() => {
          // Méthode simple et directe qui marche mieux sur mobile
          window.location.assign(whatsappUrl);
        }, 1000);
      } else {
        toast.error("Erreur lors de la sauvegarde de la commande", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde de la commande", {
        position: "top-center",
      });
    } finally {
      setIsSavingOrder(false);
    }
  };

  /*  const handleCopyOrder = async () => {
    try {
      await navigator.clipboard.writeText(formatOrderMessage());

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Commande ${orderNumber}`,
          text: formatOrderMessage(),
        });
      } catch (err) {
        console.error("Erreur lors du partage:", err);
      }
    } else {
      handleCopyOrder();
    }
  }; */

  // Attendre que le composant soit monté pour éviter l'hydratation mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-1 sm:px-4 lg:px-8">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              orderConfirmed ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <IconCheck
              className={`h-8 w-8 ${
                orderConfirmed ? "text-green-600" : "text-blue-600"
              }`}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {orderConfirmed
              ? "Commande confirmée !"
              : "Récapitulatif de commande"}
          </h1>
          <p className="text-lg text-gray-600">
            {orderConfirmed ? (
              <>
                Votre commande{" "}
                <span className="font-semibold">#{orderNumber}</span> a été
                confirmée et sauvegardée
              </>
            ) : (
              <>
                Commande <span className="font-semibold">#{orderNumber}</span>{" "}
                en cours de préparation
              </>
            )}
          </p>
          {isSavingOrder && (
            <p className="text-sm text-blue-600 mt-2">
              💾 Sauvegarde en cours...
            </p>
          )}
        </div>

        {/* Résumé de la commande */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Résumé de votre commande
            </h2>

            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.nom}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.taille && <span>Taille: {item.taille} • </span>}
                        {item.couleur && (
                          <span>Couleur: {item.couleur} • </span>
                        )}
                        Quantité: {item.quantite}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(item.prix * item.quantite).toFixed(2)}€
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.prix.toFixed(2)}€ × {item.quantite}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Sous-total:</span>
                    <span>{getTotalPrice().toFixed(2)}€</span>
                  </div>

                  {getDeliveryFee() > 0 && (
                    <div className="flex justify-between items-center text-blue-600">
                      <span>Frais de livraison:</span>
                      <span>{getDeliveryFee().toFixed(2)}€</span>
                    </div>
                  )}

                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Réduction ({appliedDiscount.discountCode}):</span>
                      <span>-{appliedDiscount.discountAmount.toFixed(2)}€</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{getFinalTotalPrice().toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Détails de la commande en cours de chargement...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Formulaire client */}
        {!formCompleted ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Informations de livraison
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Veuillez remplir vos informations pour finaliser la commande.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitCustomerInfo)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nom */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Votre nom"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Prénom */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Votre prénom"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Téléphone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+33 1 23 45 67 89"
                              type="tel"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Adresse rue */}
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Adresse *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Rue de la Paix"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Code postal */}
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="75001"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Ville */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paris"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pays */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Pays *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Belgique">Belgique</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Mode de livraison */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                      Choisissez votre mode de livraison
                    </h3>
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-4"
                            >
                              <div
                                className={`flex items-center space-x-4 bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  field.value === "hand-delivery-aulnay"
                                    ? "border-green-500 bg-green-50 shadow-md"
                                    : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                                }`}
                              >
                                <RadioGroupItem
                                  value="hand-delivery-aulnay"
                                  id="hand-delivery-aulnay"
                                  className="w-5 h-5"
                                />
                                <Label
                                  htmlFor="hand-delivery-aulnay"
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold text-gray-900 text-base block">
                                    Remise en main propre gratuite
                                  </span>
                                  <span className="text-sm text-gray-600 block mt-1">
                                    Sur Aulnay-sous-Bois
                                  </span>
                                </Label>
                                <span className="font-bold text-green-600 text-lg">
                                  GRATUIT
                                </span>
                              </div>

                              <div
                                className={`flex items-center space-x-4 bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  field.value === "hand-delivery-idf"
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                                }`}
                              >
                                <RadioGroupItem
                                  value="hand-delivery-idf"
                                  id="hand-delivery-idf"
                                  className="w-5 h-5"
                                />
                                <Label
                                  htmlFor="hand-delivery-idf"
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold text-gray-900 text-base block">
                                    Livraison de main à main
                                  </span>
                                  <span className="text-sm text-gray-600 block mt-1">
                                    En Île-de-France (gratuite à partir de 180€
                                    d&apos;achat)
                                  </span>
                                </Label>
                                <span className="font-bold text-blue-600 text-lg">
                                  Payant
                                </span>
                              </div>

                              <div
                                className={`flex items-center space-x-4 bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  field.value === "parcel-france-relais"
                                    ? "border-orange-500 bg-orange-50 shadow-md"
                                    : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
                                }`}
                              >
                                <RadioGroupItem
                                  value="parcel-france-relais"
                                  id="parcel-france-relais"
                                  className="w-5 h-5"
                                />
                                <Label
                                  htmlFor="parcel-france-relais"
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold text-gray-900 text-base block">
                                    Envoi en point relais
                                  </span>
                                  <span className="text-sm text-gray-600 block mt-1">
                                    Dans toute la France
                                  </span>
                                </Label>
                                <span className="font-bold text-orange-600 text-lg">
                                  5,00€
                                </span>
                              </div>

                              <div
                                className={`flex items-center space-x-4 bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  field.value === "parcel-france-home"
                                    ? "border-purple-500 bg-purple-50 shadow-md"
                                    : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
                                }`}
                              >
                                <RadioGroupItem
                                  value="parcel-france-home"
                                  id="parcel-france-home"
                                  className="w-5 h-5"
                                />
                                <Label
                                  htmlFor="parcel-france-home"
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold text-gray-900 text-base block">
                                    Envoi à domicile
                                  </span>
                                  <span className="text-sm text-gray-600 block mt-1">
                                    Dans toute la France
                                  </span>
                                </Label>
                                <span className="font-bold text-purple-600 text-lg">
                                  8,90€
                                </span>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      orderLoading ||
                      !form.formState.isValid ||
                      !form.watch("deliveryMethod")
                    }
                    className="w-full cursor-pointer"
                    size="lg"
                  >
                    {orderLoading
                      ? "Sauvegarde..."
                      : "Confirmer mes informations"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IconCircleCheck className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-600">
                    Informations confirmées
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormCompleted(false)}
                >
                  Modifier
                </Button>
              </div>

              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Nom complet:
                    </span>
                    <p className="text-gray-900">
                      {form.getValues("firstName")} {form.getValues("lastName")}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">
                      Téléphone:
                    </span>
                    <p className="text-gray-900">{form.getValues("phone")}</p>
                  </div>

                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">
                      Adresse de livraison:
                    </span>
                    <div className="text-gray-900 mt-1">
                      <p>{form.getValues("street")}</p>
                      <p>
                        {form.getValues("postalCode")} {form.getValues("city")}
                      </p>
                      <p>{form.getValues("country")}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">
                      Mode de livraison:
                    </span>
                    <p className="text-gray-900 mt-1">
                      {form.getValues("deliveryMethod") ===
                        "hand-delivery-aulnay" &&
                        "Remise en main propre gratuite sur Aulnay-sous-Bois"}
                      {form.getValues("deliveryMethod") ===
                        "hand-delivery-idf" &&
                        "Livraison de main à main en Île-de-France"}
                      {form.getValues("deliveryMethod") ===
                        "parcel-france-relais" && "Envoi en point relais : 5€"}
                      {form.getValues("deliveryMethod") ===
                        "parcel-france-home" && "Envoi à domicile : 8,90€"}
                      {!form.getValues("deliveryMethod") && "Non sélectionné"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions et actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {formCompleted ? "Finaliser votre commande" : "Prochaines étapes"}
            </h2>

            {!formCompleted ? (
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Remplissez vos informations</h3>
                    <p className="text-gray-600 text-sm">
                      Complétez le formulaire ci-dessus avec vos informations de
                      livraison.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-400">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">
                      Contactez-nous via WhatsApp
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Une fois vos informations confirmées, vous pourrez
                      finaliser via WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-400">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">
                      Recevez votre commande
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Livraison sous 2-5 jours ouvrables selon votre
                      localisation.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">
                      ✓
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-green-600">
                      Informations confirmées
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Vos informations de livraison ont été enregistrées.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Contactez-nous via WhatsApp</h3>
                    <p className="text-gray-600 text-sm">
                      Cliquez sur le bouton WhatsApp ci-dessous pour finaliser
                      votre commande.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Recevez votre commande</h3>
                    <p className="text-gray-600 text-sm">
                      Livraison sous 2-5 jours ouvrables selon votre
                      localisation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppClick}
                disabled={!formCompleted || isSavingOrder}
                className={`w-full h-12 text-lg ${
                  formCompleted
                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                size="lg"
              >
                <IconBrandWhatsapp className="h-6 w-6 mr-3" />
                {isSavingOrder
                  ? "Sauvegarde..."
                  : formCompleted
                  ? "Finaliser avec WhatsApp"
                  : "Complétez vos informations d'abord"}
              </Button>

              {/* Lien direct WhatsApp en backup si le bouton ne marche pas */}
              {formCompleted && (
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Si le bouton ne fonctionne pas, cliquez sur ce lien :
                  </p>
                  <a
                    href={`https://wa.me/+33759387212?text=${encodeURIComponent(
                      formatOrderMessage()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline text-sm font-medium hover:text-green-800"
                    onClick={(e) => {
                      // Empêcher le lien de s'ouvrir si on est en train de sauvegarder
                      if (isSavingOrder) {
                        e.preventDefault();
                        return;
                      }
                      // Optionnel : sauvegarder la commande quand on clique sur le lien backup
                      handleWhatsAppClick();
                    }}
                  >
                    📱 Ouvrir WhatsApp directement
                  </a>
                </div>
              )}

              {/* <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyOrder}
                  className="h-10"
                >
                  <IconCopy className="h-4 w-4 mr-2" />
                  {isCopied ? "Copié !" : "Copier"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="h-10"
                >
                  <IconShare className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Bouton retour */}
        <Card>
          <CardContent className="p-6">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full cursor-pointer"
            >
              Retourner à l&#39;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Composant principal qui encapsule avec Suspense
export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-lg text-gray-600">Chargement...</div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
