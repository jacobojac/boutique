"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../../../../public/images/logo.png";
import { WishlistIcon } from "../../store/wishlist-icon";
import { CartDrawer } from "../cart/cart-drawer";
import { AnnounecemntBar } from "./announcement-bar";
import { NavMenu } from "./nav-menu";
import { NavBarMobile } from "./nav-menu-mobile";

export const Header = () => {
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
    <header className="w-full">
      <AnnounecemntBar />
      <nav
        className={cn(
          "px-4 lg:px-32",
          navSticky
            ? "fixed top-0 z-50 w-full transition duration-500 ease-in-out shadow-lg bg-white border-b py-1"
            : "bg-white py-1"
        )}
      >
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-white py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src={Logo} alt="" className="w-36 h-auto" />
            </Link>
            {!isMobile ? <NavMenu /> : <NavBarMobile />}
            <div className="flex items-center gap-3">
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
