import { Award, Gift, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoyaltyPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Loyalty Points</h1>
        <p className="text-gray-500">Earn points with every order and get rewards</p>
      </div>

      <div className="bg-gradient-to-r from-tendercuts-red to-tendercuts-red/90 text-white rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Available Points</p>
            <p className="text-4xl font-bold">1,250</p>
            <p className="text-sm opacity-90 mt-1">You're a Silver Member</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Award className="h-10 w-10" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex justify-between text-sm mb-1">
            <span>Silver Tier</span>
            <span>Gold Tier at 2,000 points</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full" 
              style={{ width: '62.5%' }} // 1250/2000 = 62.5%
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-tendercuts-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-tendercuts-red" />
            </div>
            <h3 className="font-medium mb-2">Earn Points</h3>
            <p className="text-sm text-gray-600">Earn 10 points for every ₹100 spent</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-tendercuts-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-tendercuts-red" />
            </div>
            <h3 className="font-medium mb-2">Level Up</h3>
            <p className="text-sm text-gray-600">Advance through tiers for better rewards</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-tendercuts-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-tendercuts-red" />
            </div>
            <h3 className="font-medium mb-2">Redeem Rewards</h3>
            <p className="text-sm text-gray-600">Use points for discounts and special offers</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Order #12345</p>
              <p className="text-sm text-gray-500">25 May 2023</p>
            </div>
            <p className="text-green-600 font-medium">+250 points</p>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Order #12344</p>
              <p className="text-sm text-gray-500">15 May 2023</p>
            </div>
            <p className="text-green-600 font-medium">+500 points</p>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Welcome Bonus</p>
              <p className="text-sm text-gray-500">1 May 2023</p>
            </div>
            <p className="text-green-600 font-medium">+500 points</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            Points expire after 12 months of inactivity
          </p>
          <div className="mt-4 text-center">
            <Link href="/category/fish-combo">
              <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
                Start Earning Points
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
