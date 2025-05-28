"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import ImprovedLoyaltyPage from "./improved-page";

export default function LoyaltyPage() {
  // Redirect to the improved version
  useEffect(() => {
    redirect('/account/loyalty/improved');
  }, []);
  
  // Return the improved page as a fallback
  return <ImprovedLoyaltyPage />;
}
