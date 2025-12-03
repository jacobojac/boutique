"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import type { NavMenuItemWithCollection } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WishlistIcon } from "../../store/wishlist-icon";
import { CartDrawer } from "../cart/cart-drawer";
import { AnnounecemntBar } from "./announcement-bar";
import { NavMenu } from "./nav-menu";
import { NavBarMobile } from "./nav-menu-mobile";
import { SearchBar } from "./search-bar";

interface HeaderProps {
  menuHomme: NavMenuItemWithCollection[];
  menuFemme: NavMenuItemWithCollection[];
}

export const Header = ({ menuHomme, menuFemme }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [navSticky, setNavSticky] = useState<boolean>(false);
  const { config } = useHomePageConfig();

  useEffect(() => {
    window.document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        setNavSticky(true);
      } else {
        setNavSticky(false);
      }
    });
    /* window.document.addEventListener('scroll', () => {
        setSubnav(0);
    }); */
  });

  return (
    <header className="w-full border-b border-gray-200">
      <AnnounecemntBar />
      <nav
        className={cn(
          "px-4 lg:px-32",
          navSticky
            ? "fixed top-0 z-50 w-full transition duration-500 ease-in-out shadow-lg bg-white border-b py-1"
            : "bg-white py-2"
        )}
      >
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-white py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              {/* <Image src={Logo} alt="" className="w-36 h-auto" /> */}
              <span className="text-black text-2xl tracking-wide uppercase font-medium">
                <span className="font-extrabold">ELITE</span>{" "}
                <span className="font-light">CORNER</span>
              </span>
            </Link>
            {!isMobile ? (
              <NavMenu menuHomme={menuHomme} menuFemme={menuFemme} />
            ) : (
              <NavBarMobile menuHomme={menuHomme} menuFemme={menuFemme} />
            )}
            <div className="flex items-center gap-x-2">
              <SearchBar />
              <WishlistIcon />
              <CartDrawer />
              {/* Mobile Menu */}
              <div className="md:hidden"></div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
