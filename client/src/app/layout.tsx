import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import ClientBody from "./ClientBody";
import RootLayout from "@/components/layout/RootLayout";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { NetworkStatus } from "@/components/ui/network-status";
import { ToastProvider } from "@/components/ui/toast-notification";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e53e3e" // Restored to red color
};

export const metadata: Metadata = {
  title: "Kadal Thunai - Fresh Seafood Online Delivery | Order Fish & Seafood",
  description: "Kadal Thunai - Order Fresh Fish, Prawns, Crabs & Ready to Cook seafood online. 100% Fresh, Sustainably Sourced Seafood delivered to your doorstep.",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kadal Thunai",
  },
  keywords: "fresh fish, seafood delivery, online fish market, prawns, crabs, sustainable seafood",
  authors: [{ name: "Kadal Thunai Team" }],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://kadalthunai.com",
    title: "Kadal Thunai - Fresh Seafood Online Delivery",
    description: "Order Fresh Fish & Seafood Online - 100% Fresh, Sustainably Sourced",
    siteName: "Kadal Thunai",
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
          <SmoothScrollProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <RootLayout>
                    {children}
                    <NetworkStatus />
                  </RootLayout>
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </SmoothScrollProvider>
        </ClientBody>
      </body>
    </html>
  );
}
