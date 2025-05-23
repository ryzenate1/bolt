import "@/app/globals.css";
import type { Metadata } from "next";
import ClientBody from "./ClientBody";
import RootLayout from "@/components/layout/RootLayout";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "TenderCuts - Fresh Meat Online Delivery | Order Chicken, Mutton, Fish",
  description: "TenderCuts - Order Fresh Chicken, Mutton, Seafood & Ready to Cook online. 100% Fresh, Halal & Antibiotic-Free Meat delivered in 90 minutes.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientBody>
          <AuthProvider>
            <CartProvider>
              <RootLayout>
                {children}
              </RootLayout>
            </CartProvider>
          </AuthProvider>
        </ClientBody>
      </body>
    </html>
  );
}
