"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  IconCircleCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schéma de validation pour le formulaire client
const customerSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  street: z.string().min(5, "Adresse invalide"),
  postalCode: z.string().min(4, "Code postal invalide"),
  city: z.string().min(2, "Ville invalide"),
  country: z.string().min(2, "Pays requis"),
  deliveryMethod: z.enum(["parcel-france-relais", "parcel-france-home"]),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");

  const { items, clearCart } = useCartStore();
  const { createOrder } = useOrder();

  const [orderNumber, setOrderNumber] = useState("");
  const [formCompleted, setFormCompleted] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      postalCode: "",
      city: "",
      country: "France",
      deliveryMethod: "parcel-france-relais",
    },
  });

  // Génération du numéro de commande
  useEffect(() => {
    if (orderNumberParam) {
      setOrderNumber(orderNumberParam);
    } else {
      const generateOrderNumber = () => {
        const prefix = "CMD";
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
      };
      setOrderNumber(generateOrderNumber());
    }
  }, [orderNumberParam]);

  // Calcul des prix
  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.prix * item.quantite, 0);
  }, [items]);

  const getDeliveryFee = useCallback(() => {
    const method = form.watch("deliveryMethod");
    if (method === "parcel-france-relais") return 5.9;
    if (method === "parcel-france-home") return 15.0;
    return 0;
  }, [form]);

  const getFinalTotalPrice = useCallback(() => {
    const total = getTotalPrice() + getDeliveryFee();
    return Math.max(0, total);
  }, [getTotalPrice, getDeliveryFee]);

  const onSubmitCustomerInfo = async () => {
    setFormCompleted(true);
    toast.success("Informations confirmées");
  };

  const formatOrderMessage = useCallback(() => {
    const customerData = form.getValues();
    let message = `🛍️ *Nouvelle Commande - ${orderNumber}*\n\n`;

    message += `👤 *Informations Client:*\n`;
    message += `Nom: ${customerData.firstName} ${customerData.lastName}\n`;
    message += `Email: ${customerData.email}\n`;
    message += `Téléphone: ${customerData.phone}\n`;
    message += `Adresse: ${customerData.street}, ${customerData.postalCode} ${customerData.city}, ${customerData.country}\n\n`;

    message += `🚚 *Mode de livraison:*\n`;
    message += customerData.deliveryMethod === "parcel-france-relais"
      ? "Point relais - 5,90€\n\n"
      : "Livraison à domicile - 15,00€\n\n";

    message += `📦 *Articles:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nom}\n`;
      if (item.taille) message += `   Taille: ${item.taille}\n`;
      if (item.couleur) message += `   Couleur: ${item.couleur}\n`;
      message += `   Quantité: ${item.quantite}\n`;
      message += `   Prix: ${(item.prix * item.quantite).toFixed(2)}€\n\n`;
    });

    message += `💰 *Résumé:*\n`;
    message += `Sous-total: ${getTotalPrice().toFixed(2)}€\n`;
    message += `Livraison: ${getDeliveryFee().toFixed(2)}€\n`;
    message += `*Total: ${getFinalTotalPrice().toFixed(2)}€*`;

    return message;
  }, [form, items, orderNumber, getTotalPrice, getDeliveryFee, getFinalTotalPrice]);

  const handleWhatsAppClick = async () => {
    if (!formCompleted) {
      toast.error("Veuillez compléter le formulaire");
      return;
    }

    setIsSavingOrder(true);

    try {
      const customerData = form.getValues();
      const fullName = `${customerData.firstName} ${customerData.lastName}`;

      const orderData = await createOrder(
        orderNumber,
        items,
        getFinalTotalPrice(),
        {
          name: fullName,
          email: customerData.email,
          phone: customerData.phone,
          street: customerData.street,
          postalCode: customerData.postalCode,
          city: customerData.city,
          country: customerData.country,
          deliveryMethod: customerData.deliveryMethod,
        }
      );

      if (orderData) {
        const message = formatOrderMessage();
        const whatsappUrl = `https://wa.me/+33757837110?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");

        setTimeout(() => {
          clearCart();
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde de la commande");
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (items.length === 0 && !orderNumberParam) {
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
        <div className="grid lg:grid-cols-2">
          {/* Colonne gauche - Formulaire */}
          <div className="bg-white px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
            {/* Logo / Titre */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                ELITE <span className="font-light">CORNER</span>
              </h1>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
              <span>Panier</span>
              <IconChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="font-semibold text-gray-900">Informations</span>
              <IconChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span>Paiement</span>
            </div>

            {/* Résumé mobile */}
            <button
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="lg:hidden w-full flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {showOrderSummary ? "Masquer" : "Afficher"} le résumé
                </span>
                <IconChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showOrderSummary ? "rotate-180" : ""
                  }`}
                />
              </div>
              <span className="text-lg font-bold">
                {getFinalTotalPrice().toFixed(2)}€
              </span>
            </button>

            {/* Résumé mobile expansible */}
            {showOrderSummary && (
              <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.nom}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantite}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.nom}</p>
                        <p className="text-xs text-gray-500">
                          {item.taille && `${item.taille}`}
                          {item.couleur && ` • ${item.couleur}`}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {(item.prix * item.quantite).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulaire */}
            {!formCompleted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitCustomerInfo)} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Coordonnées</h2>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              type="email"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Livraison</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Prénom" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Nom" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Adresse" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Code postal" className="h-12" {...field} />
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
                              <FormControl>
                                <Input placeholder="Ville" className="h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Pays" />
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

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Téléphone" type="tel" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Mode de livraison</h2>
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              <Label
                                htmlFor="parcel-france-relais"
                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  field.value === "parcel-france-relais"
                                    ? "border-black bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="parcel-france-relais"
                                    id="parcel-france-relais"
                                  />
                                  <span className="font-medium">Point relais</span>
                                </div>
                                <span className="font-semibold">5,90€</span>
                              </Label>

                              <Label
                                htmlFor="parcel-france-home"
                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  field.value === "parcel-france-home"
                                    ? "border-black bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="parcel-france-home"
                                    id="parcel-france-home"
                                  />
                                  <span className="font-medium">Livraison à domicile</span>
                                </div>
                                <span className="font-semibold">15,00€</span>
                              </Label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white"
                    size="lg"
                  >
                    Continuer vers WhatsApp
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <IconCircleCheck className="h-5 w-5" />
                  <span className="font-medium">Informations confirmées</span>
                </div>

                <Button
                  onClick={handleWhatsAppClick}
                  disabled={isSavingOrder}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
                  size="lg"
                >
                  <IconBrandWhatsapp className="h-5 w-5" />
                  {isSavingOrder ? "Sauvegarde..." : "Finaliser sur WhatsApp"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setFormCompleted(false)}
                  className="w-full h-12"
                >
                  Modifier les informations
                </Button>
              </div>
            )}
          </div>

          {/* Colonne droite - Résumé (desktop uniquement) */}
          <div className="hidden lg:block bg-gray-50 px-12 py-12 border-l border-gray-200">
            <div className="sticky top-12">
              {/* Articles */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.nom}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantite}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.nom}</p>
                      <p className="text-xs text-gray-500">
                        {item.taille && `${item.taille}`}
                        {item.couleur && ` • ${item.couleur}`}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(item.prix * item.quantite).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Totaux */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{getTotalPrice().toFixed(2)}€</span>
                </div>

                {getDeliveryFee() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium">{getDeliveryFee().toFixed(2)}€</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  {getFinalTotalPrice().toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
