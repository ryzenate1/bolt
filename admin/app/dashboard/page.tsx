"use client";

import { useEffect, useState, useCallback } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, LayoutList, ShoppingBag, BarChart3, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SERVER_API_URL = 'http://localhost:5001/api';

interface OverviewStats {
  productsCount: number;
  categoriesCount: number;
  ordersCount: number; 
  usersCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch count from individual endpoints
      const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${SERVER_API_URL}/products?countOnly=true`).catch(() => null),
        fetch(`${SERVER_API_URL}/categories?countOnly=true`).catch(() => null),
        fetch(`${SERVER_API_URL}/orders?countOnly=true`).catch(() => null),
        fetch(`${SERVER_API_URL}/users?countOnly=true`).catch(() => null)
      ]);
      
      // Function to safely parse responses
      const getCount = async (res: Response | null, defaultCount = 0) => {
        if (!res) return defaultCount;
        
        try {
          if (!res.ok) return defaultCount;
          const data = await res.json();
          return data.count || defaultCount;
        } catch (err) {
          console.error("Error parsing response:", err);
          return defaultCount;
        }
      };
      
      // Get counts, using 0 as fallback
      const productsCount = await getCount(productsRes);
      const categoriesCount = await getCount(categoriesRes);
      const ordersCount = await getCount(ordersRes);
      const usersCount = await getCount(usersRes);
      
      setStats({ 
        productsCount, 
        categoriesCount, 
        ordersCount, 
        usersCount 
      });
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);
  
  const statItems = [
    { title: "Total Products", count: stats?.productsCount, icon: ShoppingBag, link: "/dashboard/products", color: "text-blue-500" },
    { title: "Total Categories", count: stats?.categoriesCount, icon: LayoutList, link: "/dashboard/categories", color: "text-green-500" },
    { title: "Total Orders", count: stats?.ordersCount, icon: ShoppingBag, link: "/dashboard/orders", color: "text-yellow-500" },
    { title: "Total Users", count: stats?.usersCount, icon: Users, link: "/dashboard/users", color: "text-purple-500" }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="Dashboard Overview"
        description="Welcome to your admin panel. Here's a quick summary of your store."
      />

      {loading && (
        <div className="p-4 flex justify-center items-center min-h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-2">Loading dashboard...</p>
        </div>
      )}

      {!loading && error && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle size={20} className="mr-2" /> Data Loading Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-600">
            <p>{error}</p>
            <p className="mt-2 text-sm">Please ensure the backend server is running and accessible at {SERVER_API_URL}.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => (
            <Card key={item.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count !== undefined ? item.count : 0}</div>
                <Link href={item.link} className="text-xs text-muted-foreground hover:underline">
                  View {item.title.split(' ')[1].toLowerCase()}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}