"use client";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { IconHeart } from "@tabler/icons-react";
import Link from "next/link";

export function WishlistIcon() {
  const { getItemsCount, hasHydrated } = useWishlistStore();

  // Utiliser directement getItemsCount() pour une réactivité immédiate
  const itemsCount = hasHydrated ? getItemsCount() : 0;

  return (
    <Link href="/wishlist">
      <Button
        className="relative rounded-full hover:bg-transparent cursor-pointer h-8 w-8 flex items-center justify-center p-0"
        size="icon"
        variant="ghost"
      >
        <IconHeart className="h-7 w-7" stroke={1} />
        {hasHydrated && itemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#EA445A] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemsCount > 9 ? "9+" : itemsCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
