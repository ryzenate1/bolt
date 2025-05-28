"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ArrowLeft, Loader2, Package, RefreshCw, ShoppingCart, UserCircle, MapPin, CreditCard, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const SERVER_API_URL = 'http://localhost:5001/api';

// Interfaces (can be moved to a shared types file)
interface UserInfo {
  id: string;
  name?: string;
  email: string;
  phoneNumber?: string;
}

interface OrderAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  product?: { name: string; imageUrl?: string | null }; // Assuming product name and image might be populated
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  user?: UserInfo;
  addressId?: string;
  address?: OrderAddress; 
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  pointsEarned?: number;
}

const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "refunded"];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_API_URL}/orders/${orderId}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Error fetching order: ${res.statusText}` }));
        throw new Error(errData.message);
      }
      const data: Order = await res.json();
      setOrder(data);
      setSelectedOrderStatus(data.status);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error Fetching Order Details", description: err.message, variant: "destructive" });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleUpdateStatus = async () => {
    if (!order || !selectedOrderStatus || selectedOrderStatus === order.status) {
        toast({ title: "No Change", description: "Order status is already set to this value.", variant: "default" });
        return;
    }
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${SERVER_API_URL}/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedOrderStatus }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Failed to update status: ${res.statusText}`}));
        throw new Error(errData.message);
      }
      const updatedOrder: Order = await res.json();
      setOrder(updatedOrder);
      setSelectedOrderStatus(updatedOrder.status);
      toast({ title: "Order Status Updated", description: `Order status changed to ${updatedOrder.status}.`, variant: "default" });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Orders
          </Button>
        <Card className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Order Details</h2>
          <p className="text-muted-foreground">{error || "The order could not be found or there was an issue retrieving the data."}</p>
        </Card>
      </div>
    );
  }

  const { user, address: shippingAddress, orderItems } = order;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Orders
        </Button>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchOrderDetails} disabled={loading || isUpdatingStatus}>
                <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
            {/* <Button variant="outline"><Edit3 size={16} className="mr-2" /> Edit Order (Future)</Button> */} 
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <CardTitle className="text-2xl">Order #{order.id.substring(0,8)}...</CardTitle>
                    <CardDescription>
                        Placed on: {new Date(order.createdAt).toLocaleString()} | Last updated: {new Date(order.updatedAt).toLocaleString()}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-3 sm:w-auto w-full">
                    <Select value={selectedOrderStatus} onValueChange={setSelectedOrderStatus} disabled={isUpdatingStatus}>
                        <SelectTrigger className="sm:w-[180px] w-full">
                            <SelectValue placeholder="Change status..." />
                        </SelectTrigger>
                        <SelectContent>
                            {orderStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus || selectedOrderStatus === order.status} className="w-full sm:w-auto">
                        {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Status"}
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">
                        <ShoppingCart size={20} className="text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Order Items ({orderItems?.length || 0})</h3>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(!orderItems || orderItems.length === 0) && <p className="p-4 text-muted-foreground">No items in this order.</p>}
                        {orderItems && orderItems.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px] hidden sm:table-cell">Image</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.product?.imageUrl ? 
                                                    <img src={item.product.imageUrl} alt={item.product.name} className="h-10 w-10 object-cover rounded"/> :
                                                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center"><Package size={18}/></div>    
                                                }
                                            </TableCell>
                                            <TableCell className="font-medium">{item.product?.name || item.productId}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">
                        <UserCircle size={20} className="text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Customer Details</h3>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm space-y-1">
                        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {user?.email || order.userId}</p>
                        <p><strong>Phone:</strong> {user?.phoneNumber || 'N/A'}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">
                        <MapPin size={20} className="text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Shipping Address</h3>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm space-y-1">
                        {shippingAddress ? (
                            <>
                                <p><strong>{shippingAddress.name || user?.name || 'N/A'}</strong></p>
                                <p>{shippingAddress.address}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                            </>
                        ) : <p className="text-muted-foreground">No shipping address provided.</p>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">
                        <CreditCard size={20} className="text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Payment Summary</h3>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm space-y-1">
                        <p><strong>Total Amount:</strong> <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span></p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
                        <p><strong>Payment Status:</strong> {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
                        <p><strong>Points Earned:</strong> {order.pointsEarned || 0}</p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>
    </div>
  );
} 