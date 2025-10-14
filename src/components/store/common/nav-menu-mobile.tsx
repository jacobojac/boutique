"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconMenuDeep, IconSquareX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

const menuFemme: { titre: string; link: string }[] = [
  {
    titre: "Manteaux/Vestes",
    link: "/categories/femmes/vetements/manteaux-vestes",
  },
  {
    titre: "Hauts/Top",
    link: "/categories/femmes/vetements/hauts-top",
  },
  {
    titre: "Pantalons",
    link: "/categories/femmes/vetements/pantalons",
  },
  {
    titre: "Ensembles",
    link: "/categories/femmes/vetements/ensembles",
  },
  {
    titre: "Chaussures",
    link: "/categories/femmes/chaussures",
  },
  {
    titre: "Accesoires",
    link: "/categories/femmes/vetements/accessoires",
  },
];

const menuHomme: { titre: string; link: string }[] = [
  {
    titre: "Manteaux/Vestes",
    link: "/categories/hommes/vetements/manteaux-vestes",
  },
  {
    titre: "Hauts/Top",
    link: "/categories/hommes/vetements/hauts-top",
  },
  {
    titre: "Pantalons",
    link: "/categories/hommes/vetements/pantalons",
  },
  {
    titre: "Ensembles",
    link: "/categories/hommes/vetements/ensembles",
  },
  {
    titre: "Chaussures",
    link: "/categories/hommes/chaussures",
  },
  {
    titre: "Accesoires",
    link: "/categories/hommes/vetements/accessoires",
  },
];

export const NavBarMobile = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <div className="order-3">
      <Drawer direction="right" open={openMenu} onOpenChange={setOpenMenu}>
        <DrawerTrigger>
          <IconMenuDeep className="h-8 w-8" />
        </DrawerTrigger>
        <DrawerContent className="h-full w-full sm:max-w-md sm:ml-auto right-0 top-0 bottom-0 fixed z-50 sm:rounded-l-lg data-[vaul-drawer-direction=right]:w-full sm:data-[vaul-drawer-direction=right]:w-auto">
          <DrawerHeader>
            <DrawerTitle className="flex justify-end">
              <DrawerClose asChild>
                <IconSquareX className="h-8 w-8" />
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 flex flex-col gap-y-4 h-full overflow-y-auto">
            {/* Accueil */}
            <div
              className="border-b border-gray-200 pb-3"
              onClick={() => setOpenMenu(false)}
            >
              <Link
                href="/"
                className="text-lg font-semibold text-gray-900 hover:text-gray-600"
              >
                🏠 Accueil
              </Link>
            </div>

            {/* Section Femme */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                Pour Elle
              </h3>
              <ul className="space-y-2 pl-4">
                {menuFemme.map((menu) => (
                  <li key={menu.titre} onClick={() => setOpenMenu(false)}>
                    <Link
                      href={menu.link}
                      className="text-base text-gray-700 hover:text-gray-900 hover:font-medium transition-colors block py-1"
                    >
                      {menu.titre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section Homme */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                Pour Lui
              </h3>
              <ul className="space-y-2 pl-4">
                {menuHomme.map((menu) => (
                  <li key={menu.titre} onClick={() => setOpenMenu(false)}>
                    <Link
                      href={menu.link}
                      className="text-base text-gray-700 hover:text-gray-900 hover:font-medium transition-colors block py-1"
                    >
                      {menu.titre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Favoris */}
            <div
              className="border-t border-gray-200 pt-3 mt-auto"
              onClick={() => setOpenMenu(false)}
            >
              <Link
                href="/wishlist"
                className="text-lg font-semibold text-gray-900 hover:text-gray-600"
              >
                Mes favoris
              </Link>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
