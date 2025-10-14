"use client";

import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    link: "/categorie/hommes/chaussures",
  },
  {
    titre: "Accesoires",
    link: "/categories/hommes/vetements/accessoires",
  },
];

export function NavMenu() {
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>POUR ELLE</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 w-[200px]">
              {menuFemme.map((menu) => (
                <ListItem
                  key={menu.titre}
                  title={menu.titre}
                  href={menu.link}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>POUR LUI</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 w-[200px]">
              {menuHomme.map((menu) => (
                <ListItem
                  key={menu.titre}
                  title={menu.titre}
                  href={menu.link}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/wishlist">FAVORIS</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
