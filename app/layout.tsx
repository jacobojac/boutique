import { cn } from "@/lib/utils";
import { Geist_Mono, Josefin_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const josefin = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="fr" suppressHydrationWarning>
        <head />
        <body
          className={cn(josefin.variable, "antialiased", "h-full")}
          suppressHydrationWarning={true}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </>
  );
}
