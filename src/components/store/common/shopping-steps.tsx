import {
  IconBrandWhatsapp,
  IconSearch,
  IconShoppingBag,
  IconTruck,
} from "@tabler/icons-react";

export default function ShoppingSteps() {
  const steps = [
    {
      icon: IconSearch,
      title: "Parcourez",
      description: "Découvrez notre sélection de produits tendance",
    },
    {
      icon: IconShoppingBag,
      title: "Ajoutez au panier",
      description: "Sélectionnez vos articles favoris",
    },
    {
      icon: IconBrandWhatsapp,
      title: "Commandez sur WhatsApp",
      description: "Finalisez votre achat en toute simplicité",
    },
    {
      icon: IconTruck,
      title: "Recevez chez vous",
      description: "Livraison rapide à votre adresse",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            COMMANDEZ EN TOUTE SIMPLICITÉ
          </h2>
          <div className="w-20 h-[8px] bg-black mx-auto mb-20"></div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-200 rotate-45 transform translate-x-1/2"></div>
                </div>
              )}

              {/* Step content */}
              <div className="relative z-10 text-center">
                {/* Icon circle */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-gray-200 mb-4 transition-all duration-300 hover:border-black hover:shadow-lg bg-tertiory">
                  <step.icon className="w-10 h-10 text-gray-900" stroke={1} />
                </div>

                {/* Step number */}
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Text content */}
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
