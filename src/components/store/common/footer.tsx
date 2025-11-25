import type { NavMenuItemWithCollection } from "@/lib/site-config";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  menuHomme: NavMenuItemWithCollection[];
  menuFemme: NavMenuItemWithCollection[];
}

export default function Footer({ menuHomme, menuFemme }: FooterProps) {
  return (
    <footer className="bg-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            {/* <Link href="/">
              <Image src={Logo} alt="" className="w-36 h-auto" />
            </Link> */}
            <span className="text-white text-2xl tracking-wide uppercase font-medium">
              <span className="font-extrabold">ELITE</span>{" "}
              <span className="font-light">CORNER</span>
            </span>
          </div>

          {/* HOMME */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">HOMME</h4>
            <ul className="space-y-3 text-sm text-gray-100">
              {menuHomme.map((menu) => (
                <li key={menu.id}>
                  <Link
                    href={`/homme/${menu.collectionSlug}`}
                    className="hover:text-white transition-colors"
                  >
                    {menu.collectionNom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FEMME */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">FEMME</h4>
            <ul className="space-y-3 text-sm text-gray-100">
              {menuFemme.map((menu) => (
                <li key={menu.id}>
                  <Link
                    href={`/femme/${menu.collectionSlug}`}
                    className="hover:text-white transition-colors"
                  >
                    {menu.collectionNom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">LIVRAISON</h4>
            <div className="flex flex-col gap-4">
              <Image
                src="/images/Colissimo_Logo.svg"
                alt="Colissimo"
                width={120}
                height={40}
                className="brightness-0 invert"
              />
              <Image
                src="/images/Logo_Mondial_Relay_-_2022.svg"
                alt="Mondial Relay"
                width={120}
                height={40}
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
