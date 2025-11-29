import {
  IconDiamond,
  IconHeadset,
  IconShieldLock,
  IconTruck,
} from "@tabler/icons-react";

export default function CustomerExperience() {
  const features = [
    {
      icon: <IconDiamond className="h-12 w-12" stroke={1} />,
      title: "PRODUITS PREMIUMS",
      description: "Produits sélectionnés",
    },
    {
      icon: <IconShieldLock className="h-12 w-12" stroke={1} />,
      title: "PAIEMENT SÉCURISÉ",
      description: "Assistance 7j/7 par chat",
    },
    {
      icon: <IconTruck className="h-12 w-12" stroke={1} />,
      title: "LIVRAISON RAPIDE",
      description: "Expédition sous 24-48h",
    },
    {
      icon: <IconHeadset className="h-12 w-12" stroke={1} />,
      title: "SUPPORT 24/7",
      description: "Assistance 7j/7 par chat",
    },
  ];

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-tertiory">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-sm md:text-lg text-gray-900 mb-2">
                {feature.title}
              </h3>
              {/*   <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
