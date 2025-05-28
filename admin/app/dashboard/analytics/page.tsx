"use client";

import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, LineChart, PieChart, Calendar, TrendingUp, Users, ShoppingCart } from 'lucide-react';

// Sample analytics data (would come from API in production)
const analyticsData = {
  sales: {
    daily: 2450,
    weekly: 14500,
    monthly: 52000,
    yearToDate: 342000,
    change: 12.5,
  },
  orders: {
    daily: 18,
    weekly: 125,
    monthly: 540,
    yearToDate: 3200,
    change: 8.2,
  },
  visits: {
    daily: 320,
    weekly: 2240,
    monthly: 9600,
    yearToDate: 115000,
    change: -3.5,
  },
  conversions: {
    daily: 5.6,
    weekly: 5.5,
    monthly: 5.6,
    yearToDate: 4.8,
    change: 0.3,
  }
};

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearToDate'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // For now using mock data, but in a real implementation this would fetch from the API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation:
        // const res = await fetch(`/api/analytics?timeframe=${timeframe}`);
        // if (!res.ok) throw new Error('Failed to fetch analytics data');
        // const data = await res.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error loading analytics",
          description: "Could not load analytics data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeframe, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="Analytics Dashboard"
        description="Track your store's performance metrics and sales data."
        icon={<BarChart3 className="h-6 w-6 mr-2" />}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg p-2 inline-flex shadow-sm">
            <button 
              onClick={() => setTimeframe('daily')} 
              className={`px-3 py-1 rounded ${timeframe === 'daily' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setTimeframe('weekly')} 
              className={`px-3 py-1 rounded ${timeframe === 'weekly' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setTimeframe('monthly')} 
              className={`px-3 py-1 rounded ${timeframe === 'monthly' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              This Month
            </button>
            <button 
              onClick={() => setTimeframe('yearToDate')} 
              className={`px-3 py-1 rounded ${timeframe === 'yearToDate' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              Year to Date
            </button>
          </div>
        </div>
        
        <TabsContent value="overview" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Sales Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : formatCurrency(analyticsData.sales[timeframe])}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className={analyticsData.sales.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {analyticsData.sales.change >= 0 ? "+" : ""}{analyticsData.sales.change}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
            
            {/* Orders Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : analyticsData.orders[timeframe]}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className={analyticsData.orders.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {analyticsData.orders.change >= 0 ? "+" : ""}{analyticsData.orders.change}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
            
            {/* Visits Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Store Visits</CardTitle>
                <Users className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : analyticsData.visits[timeframe]}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className={analyticsData.visits.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {analyticsData.visits.change >= 0 ? "+" : ""}{analyticsData.visits.change}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
            
            {/* Conversion Rate Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <PieChart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : analyticsData.conversions[timeframe]}%
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className={analyticsData.conversions.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {analyticsData.conversions.change >= 0 ? "+" : ""}{analyticsData.conversions.change}%
                  </span>
                  <span className="ml-1">from previous period</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {/* Sales Chart Placeholder */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Trend</CardTitle>
                <div className="flex items-center space-x-2">
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last {timeframe === 'daily' ? '24 hours' : timeframe === 'weekly' ? '7 days' : timeframe === 'monthly' ? '30 days' : '12 months'}</span>
                </div>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Sales trend visualization will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Connect your analytics API to enable charts</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Products Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Product performance data will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <PieChart className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Customer data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sales Tab Content */}
        <TabsContent value="sales" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Detailed sales analytics will appear here</p>
                <p className="text-sm text-gray-400">Connect your sales data to enable this feature</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents would go here */}
        <TabsContent value="products" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Product analytics will appear here</p>
                <p className="text-sm text-gray-400">Connect your product data to enable this feature</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Customer analytics will appear here</p>
                <p className="text-sm text-gray-400">Connect your customer data to enable this feature</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 