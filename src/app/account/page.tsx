"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { User, MapPin, Clock, HelpCircle, Shield, LogOut, ChevronRight, Award, Phone, Mail, FileText, Lock, User as UserIcon, Home, Package, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const menuItems = [
  { id: 'account', icon: User, label: 'My Account', href: '/account' },
  { id: 'orders', icon: Package, label: 'My Orders', href: '/account/orders' },
  { id: 'addresses', icon: Home, label: 'Saved Addresses', href: '/account/addresses' },
  { id: 'payments', icon: CreditCard, label: 'Payment Methods', href: '/account/payments' },
  { id: 'loyalty', icon: Award, label: 'Loyalty Points', href: '/account/loyalty' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', href: '/account/help' },
  { id: 'privacy', icon: Shield, label: 'Privacy Policy', href: '/privacy' },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop() || 'account';

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isActive = (path: string) => {
    return pathname === path || (path === '/account' && pathname === '/account');
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <Card className="overflow-hidden h-full">
          <div className="bg-tendercuts-red p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "Guest"}</h2>
                <p className="text-sm opacity-80">+91 {user?.phoneNumber || "XXXXXXXXXX"}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive(item.href) 
                        ? 'bg-gray-100 text-tendercuts-red' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 mt-4"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                    <span>{user?.name || "Not provided"}</span>
                    <Button variant="ghost" size="sm" className="text-tendercuts-red">
                      Edit
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                    <span>{user?.email || "Not provided"}</span>
                    <Button variant="ghost" size="sm" className="text-tendercuts-red">
                      Edit
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                    <span>+91 {user?.phoneNumber || "XXXXXXXXXX"}</span>
                    <Button variant="ghost" size="sm" className="text-tendercuts-red">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security</h3>
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/account/help" className="block">
                  <div className="p-4 border rounded-md hover:border-tendercuts-red transition-colors">
                    <div className="flex items-center">
                      <HelpCircle className="h-5 w-5 text-tendercuts-red mr-3" />
                      <span>Help Center</span>
                    </div>
                  </div>
                </Link>
                <a href="mailto:support@tendercuts.com" className="block">
                  <div className="p-4 border rounded-md hover:border-tendercuts-red transition-colors">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-tendercuts-red mr-3" />
                      <span>Email Support</span>
                    </div>
                  </div>
                </a>
                <a href="tel:+919876543210" className="block">
                  <div className="p-4 border rounded-md hover:border-tendercuts-red transition-colors">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-tendercuts-red mr-3" />
                      <span>Call Support</span>
                    </div>
                  </div>
                </a>
                <Link href="/terms" className="block">
                  <div className="p-4 border rounded-md hover:border-tendercuts-red transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-tendercuts-red mr-3" />
                      <span>Terms &amp; Conditions</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
