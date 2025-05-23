import { Button } from "@/components/ui/button";
import { Clock, Package, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-gray-500">View and manage your orders</p>
        </div>
        <Link href="/category/fish-combo">
          <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
          <Link href="/category/fish-combo" className="mt-6 inline-block">
            <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
