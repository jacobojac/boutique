import { IconHeadset, IconShieldCheck, IconTruck } from "@tabler/icons-react";

export default function CustomerExperience() {
  const features = [
    {
      icon: <IconShieldCheck className="h-8 w-8" />,
      title: "Qualité Premium",
      description: "Produits sélectionnés",
    },
    {
      icon: <IconTruck className="h-8 w-8" />,
      title: "Livraison Rapide",
      description: "Expédition sous 24-48h",
    },
    {
      icon: <IconHeadset className="h-8 w-8" />,
      title: "Support Client",
      description: "Assistance 7j/7 par chat",
    },
  ];

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto lg:px-8">
        <div className="grid grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-black text-white">
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
