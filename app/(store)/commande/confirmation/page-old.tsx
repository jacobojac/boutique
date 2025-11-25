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
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schéma de validation pour le formulaire client
const customerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
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
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
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

  // Vider le panier seulement lors de la sortie de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (orderConfirmed) {
        clearCart();
      }
    };

    const handlePopstate = () => {
      if (orderConfirmed) {
        clearCart();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
      if (orderConfirmed) {
        clearCart();
      }
    };
  }, [orderConfirmed, clearCart]);

  // Calculer les frais de livraison
  const getDeliveryFee = () => {
    const deliveryMethod = form.watch("deliveryMethod");
    if (deliveryMethod === "parcel-france-relais") {
      return 5.9;
    } else if (deliveryMethod === "parcel-france-home") {
      return 15.0;
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
      `*Email:* ${formValues.email}\n` +
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

      const result = await createOrder(
        orderNumber,
        items,
        getFinalTotalPrice(),
        {
          name: customerName,
          email: formValues.email,
          phone: formValues.phone,
          street: formValues.street,
          postalCode: formValues.postalCode,
          city: formValues.city,
          country: formValues.country,
          deliveryMethod: formValues.deliveryMethod,
        }
      );

      if (result) {
        setOrderConfirmed(true);
        localStorage.removeItem("appliedDiscount");

        toast.success(
          "Commande sauvegardée avec succès ! Ouverture de WhatsApp...",
          {
            position: "top-center",
          }
        );

        const message = encodeURIComponent(formatOrderMessage());
        const phoneNumber = "+33757837110";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        setTimeout(() => {
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

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Layout 2 colonnes */}
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 mb-6 border-2 transition-all duration-300 rounded-full ${
              orderConfirmed ? "bg-black border-black" : "bg-white border-black"
            }`}
          >
            <IconCheck
              className={`h-10 w-10 ${
                orderConfirmed ? "text-white animate-bounce" : "text-black"
              }`}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
            {orderConfirmed
              ? "Commande confirmée !"
              : "Finalisation de commande"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Commande{" "}
            <span className="font-bold text-black">#{orderNumber}</span>
            {orderConfirmed && (
              <span className="block mt-1 text-sm">
                Enregistrée avec succès
              </span>
            )}
          </p>
          {isSavingOrder && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 text-black px-4 py-2 border border-gray-300">
              <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent"></div>
              <span className="text-sm font-medium">
                Sauvegarde en cours...
              </span>
            </div>
          )}
        </div>

        {/* Résumé commande - En haut */}
        <Card className="mb-8 border-0 shadow-md">
          <CardContent className="p-6">
            {/* <h2 className="text-xl font-bold text-black mb-6 pb-4 border-b-2 border-black">
              Commande #{orderNumber}
            </h2> */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Articles - 2/3 */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-black mb-4 text-base">
                  Articles
                </h3>
                {items.length > 0 ? (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        {item.image && (
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.nom}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-black text-sm">
                            {item.nom}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
                            {item.taille && (
                              <span className="bg-white px-2 py-1 border border-gray-300">
                                {item.taille}
                              </span>
                            )}
                            {item.couleur && (
                              <span className="bg-white px-2 py-1 border border-gray-300">
                                {item.couleur}
                              </span>
                            )}
                            <span className="bg-white px-2 py-1 border border-gray-300">
                              Qté: {item.quantite}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-base text-black">
                            {(item.prix * item.quantite).toFixed(2)}€
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.prix.toFixed(2)}€ / unité
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Chargement...
                  </p>
                )}
              </div>

              {/* Récapitulatif - 1/3 */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-black mb-4 text-base">
                  Récapitulatif
                </h3>
                <div className="space-y-3 p-4 bg-tertiory border border-gray-300">
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>Sous-total</span>
                    <span className="font-semibold">
                      {getTotalPrice().toFixed(2)}€
                    </span>
                  </div>

                  {getDeliveryFee() > 0 && (
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Livraison</span>
                      <span className="font-semibold">
                        {getDeliveryFee().toFixed(2)}€
                      </span>
                    </div>
                  )}

                  {appliedDiscount && (
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Réduction</span>
                      <span className="font-semibold">
                        -{appliedDiscount.discountAmount.toFixed(2)}€
                      </span>
                    </div>
                  )}

                  <div className="border-t-2 border-black pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-black">
                        Total
                      </span>
                      <span className="text-xl font-bold text-black">
                        {getFinalTotalPrice().toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire */}
        <div className="space-y-6">
          {/* Formulaire client */}
          {!formCompleted ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-black mb-6 pb-4 border-b-2 border-black">
                  Informations de livraison
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitCustomerInfo)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="votre@email.com"
                                type="email"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0758763423"
                                type="tel"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                <SelectItem value="Belgique">
                                  Belgique
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Mode de livraison */}
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 text-base">
                        Mode de livraison
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
                                  className={`flex items-center space-x-4 bg-white p-4 border-2 cursor-pointer transition-all ${
                                    field.value === "parcel-france-relais"
                                      ? "border-black bg-gray-50"
                                      : "border-gray-300 hover:border-gray-500"
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
                                    <span className="font-semibold text-black text-sm block">
                                      Point relais
                                    </span>
                                  </Label>
                                  <span className="font-bold text-base text-black">
                                    5,90€
                                  </span>
                                </div>

                                <div
                                  className={`flex items-center space-x-4 bg-white p-4 border-2 cursor-pointer transition-all ${
                                    field.value === "parcel-france-home"
                                      ? "border-black bg-gray-50"
                                      : "border-gray-300 hover:border-gray-500"
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
                                    <span className="font-semibold text-black text-sm block">
                                      Livraison à domicile
                                    </span>
                                  </Label>
                                  <span className="font-bold text-base text-black">
                                    15,00€
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
                      className="w-full h-12 cursor-pointer bg-black hover:bg-gray-800 text-white"
                      size="lg"
                    >
                      {orderLoading
                        ? "Chargement..."
                        : "Confirmer mes informations"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
                  <div className="flex items-center gap-2">
                    <IconCircleCheck className="h-5 w-5 text-black" />
                    <h2 className="text-xl font-bold text-black">
                      Informations confirmées
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormCompleted(false)}
                    className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                  >
                    Modifier
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 border border-gray-300">
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Nom complet
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {form.getValues("firstName")}{" "}
                        {form.getValues("lastName")}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 border border-gray-300">
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Email
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {form.getValues("email")}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 border border-gray-300">
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Téléphone
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {form.getValues("phone")}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 border border-gray-300 md:col-span-2">
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Adresse
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {form.getValues("street")},{" "}
                        {form.getValues("postalCode")} {form.getValues("city")},{" "}
                        {form.getValues("country")}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 border border-gray-300 md:col-span-2">
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        Mode de livraison
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {form.getValues("deliveryMethod") ===
                          "parcel-france-relais" && "Point relais - 5,90€"}
                        {form.getValues("deliveryMethod") ===
                          "parcel-france-home" &&
                          "Livraison à domicile - 15,00€"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton WhatsApp */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Button
                onClick={handleWhatsAppClick}
                disabled={!formCompleted || isSavingOrder}
                className={`w-full h-12 text-base font-semibold ${
                  formCompleted
                    ? "bg-black hover:bg-gray-800 cursor-pointer text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                }`}
                size="lg"
              >
                <IconBrandWhatsapp className="h-5 w-5 mr-3" />
                {isSavingOrder
                  ? "Sauvegarde..."
                  : formCompleted
                  ? "Finaliser sur WhatsApp"
                  : "Complétez le formulaire"}
              </Button>
            </CardContent>
          </Card>

          {/* Bouton retour */}
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full h-12 cursor-pointer border border-gray-300 hover:bg-gray-100 shadow-sm"
          >
            Retourner à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

// Composant principal
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
