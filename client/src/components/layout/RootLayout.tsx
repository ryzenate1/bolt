"use client";

import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { Toaster } from "sonner";
import CartNotification from "../cart/CartNotification";
import { useCart, CartContextType } from "@/context/CartContext";

// Extend Window interface to include CartContext
declare global {
  interface Window {
    CartContext?: CartContextType;
  }
}


interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const [notification, setNotification] = useState({
    isOpen: false,
    fishName: ""
  });
  const { cart } = useCart();
  
  // Listen for cart changes to show notification
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tendercutsCart') {
        const oldCart = e.oldValue ? JSON.parse(e.oldValue) : [];
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        
        if (newCart.length > oldCart.length) {
          // Item added
          const newItem = newCart[newCart.length - 1];
          setNotification({
            isOpen: true,
            fishName: newItem.name
          });
        } else if (newCart.length === oldCart.length) {
          // Check if quantity increased
          for (let i = 0; i < newCart.length; i++) {
            const oldItem = oldCart.find((item: any) => item.id === newCart[i].id);
            if (oldItem && newCart[i].quantity > oldItem.quantity) {
              setNotification({
                isOpen: true,
                fishName: newCart[i].name
              });
              break;
            }
          }
        }
      }
    };
    
    // For cart updates, use the useCart hook directly
    // We'll use a simpler approach to catch cart updates
    const cartItemCount = cart.length;
    
    // Listen for cart updates
    if (cartItemCount > 0 && cart[cartItemCount - 1]) {
      const lastAddedItem = cart[cartItemCount - 1];
      setNotification({
        isOpen: true,
        fishName: lastAddedItem.name
      });
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);
  
  const closeNotification = () => {
    setNotification({
      isOpen: false,
      fishName: ""
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" richColors closeButton />
      <CartNotification 
        fishName={notification.fishName}
        isOpen={notification.isOpen}
        onClose={closeNotification}
      />
      <Header />
      <main className="flex-1 pb-16 md:pb-0"> {/* Add padding to bottom for mobile nav */}
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default RootLayout;
