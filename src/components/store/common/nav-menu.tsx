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
import type { NavMenuItemWithCollection } from "@/lib/site-config";

interface NavMenuProps {
  menuHomme: NavMenuItemWithCollection[];
  menuFemme: NavMenuItemWithCollection[];
}

export function NavMenu({ menuHomme, menuFemme }: NavMenuProps) {
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} text-lg font-light`}
          >
            <Link href="/">ACCUEIL</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {menuHomme.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-lg font-light">
              HOMME
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 w-[200px]">
                {menuHomme.map((menu) => (
                  <ListItem
                    key={menu.id}
                    title={menu.collectionNom}
                    href={`/homme/${menu.collectionSlug}`}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
        {menuFemme.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-lg font-light">
              FEMME
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 w-[200px]">
                {menuFemme.map((menu) => (
                  <ListItem
                    key={menu.id}
                    title={menu.collectionNom}
                    href={`/femme/${menu.collectionSlug}`}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
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
