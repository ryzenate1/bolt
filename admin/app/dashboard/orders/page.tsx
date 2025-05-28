"use client";

import { useEffect, useState, useCallback } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header'; // Assuming a generic header
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Eye, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const SERVER_API_URL = 'http://localhost:5001/api';

interface UserInfo { // Simplified User for display
  id: string;
  name?: string;
  email: string;
}

interface Order {
  id: string;
  userId: string;
  user?: UserInfo; // Assuming backend might populate this
  addressId?: string;
  status: string;      // e.g., "pending", "processing", "shipped", "delivered", "cancelled"
  totalAmount: number;
  paymentStatus: string; // e.g., "pending", "paid", "failed"
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  pointsEarned?: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Append query params for search & filter to API call if backend supports it
      const res = await fetch(`${SERVER_API_URL}/orders`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Error fetching orders: ${res.statusText}` }));
        throw new Error(errData.message);
      }
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error Fetching Orders", description: err.message, variant: "destructive" });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders
    .filter(order => 
      (orderStatusFilter === "all" || !orderStatusFilter) ? true : order.status === orderStatusFilter
    )
    .filter(order => 
      (paymentStatusFilter === "all" || !paymentStatusFilter) ? true : order.paymentStatus === paymentStatusFilter
    )
    .filter(order => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower)
      );
    });
  
  // Unique statuses for filter dropdowns
  const uniqueOrderStatuses = Array.from(new Set(orders.map(o => o.status)));
  const uniquePaymentStatuses = Array.from(new Set(orders.map(o => o.paymentStatus)));


  if (loading && orders.length === 0 && !error) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="Order Management"
        description="View and manage customer orders."
      />

      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4 border-b mb-4">
            <Input
              type="search"
              placeholder="Search by Order ID, Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              icon={<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            />
             <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger id="orderStatusFilter"><SelectValue placeholder="Filter by Order Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Order Statuses</SelectItem>
                {uniqueOrderStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger id="paymentStatusFilter"><SelectValue placeholder="Filter by Payment Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                {uniquePaymentStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>Error loading orders: {error}</span>
            </div>
          )}

          {filteredOrders.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 py-8">No orders found matching your criteria.</p>
          )}

          {filteredOrders.length > 0 && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>
                        <div>{order.user?.name || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{order.user?.email || order.userId}</div>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                           {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Eye size={16} className="mr-1" /> View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}