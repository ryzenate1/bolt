"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Fish, 
  ShoppingCart, 
  Users, 
  LayoutTemplate, 
  BarChart3, 
  Settings, 
  Package, 
  Tag, 
  Truck,
  Image,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: <Fish className="mr-2 h-4 w-4" />,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: <ShoppingCart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: <LayoutTemplate className="mr-2 h-4 w-4" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
  },
];

const configNavItems: NavItem[] = [
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    title: "Trusted Badges",
    href: "/dashboard/trusted-badges",
    icon: <Award className="mr-2 h-4 w-4" />,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: <Package className="mr-2 h-4 w-4" />,
  },
  {
    title: "Shipping",
    href: "/dashboard/shipping",
    icon: <Truck className="mr-2 h-4 w-4" />,
  },
  {
    title: "Media Library",
    href: "/dashboard/media",
    icon: <Image className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Fish className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-bold">Ocean Fresh</span>
        </Link>
      </div>
      <div className="space-y-1">
        <p className="px-4 text-xs font-semibold uppercase text-muted-foreground">
          Main
        </p>
        <nav className="grid gap-1 px-2">
          {mainNavItems.map((item, index) => (
            <Button
              key={index}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                pathname === item.href && "font-semibold"
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="space-y-1">
        <p className="px-4 text-xs font-semibold uppercase text-muted-foreground">
          Configuration
        </p>
        <nav className="grid gap-1 px-2">
          {configNavItems.map((item, index) => (
            <Button
              key={index}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                pathname === item.href && "font-semibold"
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}