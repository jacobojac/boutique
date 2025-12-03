import Footer from "@/components/store/common/footer";
import { Header } from "@/components/store/common/header";
import { getNavigationMenus } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elite Corner",
  description: "Vente de vêtements et accessoires de mode",
};

// Revalider toutes les 5 minutes pour avoir les menus à jour
export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { menuHomme, menuFemme } = await getNavigationMenus();

  return (
    <div className="overflow-x-hidden">
      <Header menuHomme={menuHomme} menuFemme={menuFemme} />
      <main className="mx-auto px-2 sm:px-6 lg:px-4">{children}</main>
      <Footer menuHomme={menuHomme} menuFemme={menuFemme} />
    </div>
  );
}
