"use client";

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2, Save, Store, Truck, CreditCard, Globe, Mail } from 'lucide-react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // Store settings form state
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Kadal Thunai',
    tagline: 'Fresh Seafood Delivered to Your Doorstep',
    email: 'contact@kadalthunai.com',
    phone: '+91 9876543210',
    address: '123 Fisherman\'s Wharf, Chennai, Tamil Nadu, India',
    currency: 'INR',
    language: 'en',
    timezone: 'Asia/Kolkata',
    enableReviews: true,
    enableWishlist: true,
    enableLoyaltyProgram: true,
    logo: '/images/logo.png',
    favicon: '/favicon.ico',
  });

  // Shipping settings form state
  const [shippingSettings, setShippingSettings] = useState({
    enableFreeShipping: true,
    freeShippingThreshold: '1000',
    defaultShippingFee: '100',
    allowLocalPickup: true,
    localPickupAddress: 'Shop #4, Marina Beach Market, Chennai',
    shippingZones: [
      { name: 'Chennai', fee: '50' },
      { name: 'Tamil Nadu', fee: '100' },
      { name: 'Rest of India', fee: '150' },
    ]
  });

  // Payment settings form state
  const [paymentSettings, setPaymentSettings] = useState({
    enableCashOnDelivery: true,
    enableRazorpay: true,
    razorpayKeyId: 'rzp_test_xxxxxxxxxxxxxxx',
    razorpayKeySecret: '************************',
    enablePhonePe: false,
    enableGooglePay: false,
    sandboxMode: true,
  });

  // Email settings form state
  const [emailSettings, setEmailSettings] = useState({
    senderName: 'Kadal Thunai',
    senderEmail: 'noreply@kadalthunai.com',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'smtp_username',
    smtpPassword: '************',
    enableOrderConfirmationEmails: true,
    enableShippingUpdateEmails: true,
    enableMarketingEmails: false,
    emailFooter: 'Kadal Thunai - Fresh Seafood Delivered Daily\n© 2023 Kadal Thunai. All rights reserved.',
  });

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean, settingsType: string) => {
    if (settingsType === 'store') {
      setStoreSettings(prev => ({ ...prev, [name]: checked }));
    } else if (settingsType === 'shipping') {
      setShippingSettings(prev => ({ ...prev, [name]: checked }));
    } else if (settingsType === 'payment') {
      setPaymentSettings(prev => ({ ...prev, [name]: checked }));
    } else if (settingsType === 'email') {
      setEmailSettings(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleSelectChange = (name: string, value: string, settingsType: string) => {
    if (settingsType === 'store') {
      setStoreSettings(prev => ({ ...prev, [name]: value }));
    }
    // Add other setting types as needed
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, settingsType: string) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // In a real application, you would send the settings to your API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `Your ${settingsType} settings have been updated successfully.`,
      });
    } catch (err) {
      setError(`Failed to save ${settingsType} settings. Please try again.`);
      toast({
        title: "Error Saving Settings",
        description: `There was a problem updating your ${settingsType} settings.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="Store Settings"
        description="Configure your store preferences and operational settings."
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Store size={16} /> General
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-1">
            <Truck size={16} /> Shipping
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-1">
            <CreditCard size={16} /> Payment
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail size={16} /> Email
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1">
            <Globe size={16} /> SEO
          </TabsTrigger>
        </TabsList>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* General Store Settings */}
        <TabsContent value="general">
          <form onSubmit={(e) => handleSubmit(e, 'store')}>
            <Card>
              <CardHeader>
                <CardTitle>General Store Information</CardTitle>
                <CardDescription>Basic information about your seafood store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input 
                      id="storeName" 
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Store Tagline</Label>
                    <Input 
                      id="tagline" 
                      name="tagline"
                      value={storeSettings.tagline}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={storeSettings.email}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={storeSettings.phone}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea 
                    id="address" 
                    name="address"
                    rows={3}
                    value={storeSettings.address}
                    onChange={handleStoreSettingsChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      name="currency"
                      value={storeSettings.currency}
                      onValueChange={(value) => handleSelectChange('currency', value, 'store')}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select 
                      name="language"
                      value={storeSettings.language}
                      onValueChange={(value) => handleSelectChange('language', value, 'store')}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      name="timezone"
                      value={storeSettings.timezone}
                      onValueChange={(value) => handleSelectChange('timezone', value, 'store')}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Store Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableReviews" 
                        name="enableReviews"
                        checked={storeSettings.enableReviews}
                        onCheckedChange={(checked) => handleSwitchChange('enableReviews', checked, 'store')}
                      />
                      <Label htmlFor="enableReviews">Enable Customer Reviews</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableWishlist" 
                        name="enableWishlist"
                        checked={storeSettings.enableWishlist}
                        onCheckedChange={(checked) => handleSwitchChange('enableWishlist', checked, 'store')}
                      />
                      <Label htmlFor="enableWishlist">Enable Wishlist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableLoyaltyProgram" 
                        name="enableLoyaltyProgram"
                        checked={storeSettings.enableLoyaltyProgram}
                        onCheckedChange={(checked) => handleSwitchChange('enableLoyaltyProgram', checked, 'store')}
                      />
                      <Label htmlFor="enableLoyaltyProgram">Enable Loyalty Program</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-40">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (
                    <>
                      <Save size={16} className="mr-2" /> Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <form onSubmit={(e) => handleSubmit(e, 'shipping')}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Configuration</CardTitle>
                <CardDescription>Configure shipping options and delivery zones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableFreeShipping" 
                        name="enableFreeShipping"
                        checked={shippingSettings.enableFreeShipping}
                        onCheckedChange={(checked) => handleSwitchChange('enableFreeShipping', checked, 'shipping')}
                      />
                      <Label htmlFor="enableFreeShipping">Enable Free Shipping</Label>
                    </div>
                    {shippingSettings.enableFreeShipping && (
                      <div className="pl-8">
                        <Label htmlFor="freeShippingThreshold">Free Shipping Order Threshold (₹)</Label>
                        <Input 
                          type="number"
                          id="freeShippingThreshold" 
                          name="freeShippingThreshold"
                          value={shippingSettings.freeShippingThreshold}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultShippingFee">Default Shipping Fee (₹)</Label>
                    <Input 
                      type="number"
                      id="defaultShippingFee" 
                      name="defaultShippingFee"
                      value={shippingSettings.defaultShippingFee}
                      onChange={(e) => setShippingSettings(prev => ({ ...prev, defaultShippingFee: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="allowLocalPickup" 
                    name="allowLocalPickup"
                    checked={shippingSettings.allowLocalPickup}
                    onCheckedChange={(checked) => handleSwitchChange('allowLocalPickup', checked, 'shipping')}
                  />
                  <Label htmlFor="allowLocalPickup">Allow Local Pickup</Label>
                </div>
                
                {shippingSettings.allowLocalPickup && (
                  <div className="pl-8 space-y-2">
                    <Label htmlFor="localPickupAddress">Local Pickup Address</Label>
                    <Textarea 
                      id="localPickupAddress" 
                      name="localPickupAddress"
                      rows={2}
                      value={shippingSettings.localPickupAddress}
                      onChange={(e) => setShippingSettings(prev => ({ ...prev, localPickupAddress: e.target.value }))}
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Shipping Zones</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShippingSettings(prev => ({
                        ...prev,
                        shippingZones: [...prev.shippingZones, { name: '', fee: '0' }]
                      }))}
                    >
                      Add Zone
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {shippingSettings.shippingZones.map((zone, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 items-center border p-3 rounded-md">
                        <div className="col-span-3">
                          <Label htmlFor={`zone-${index}-name`}>Zone Name</Label>
                          <Input 
                            id={`zone-${index}-name`}
                            value={zone.name}
                            onChange={(e) => {
                              const newZones = [...shippingSettings.shippingZones];
                              newZones[index].name = e.target.value;
                              setShippingSettings(prev => ({ ...prev, shippingZones: newZones }));
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-1">
                          <Label htmlFor={`zone-${index}-fee`}>Fee (₹)</Label>
                          <Input 
                            id={`zone-${index}-fee`}
                            type="number"
                            value={zone.fee}
                            onChange={(e) => {
                              const newZones = [...shippingSettings.shippingZones];
                              newZones[index].fee = e.target.value;
                              setShippingSettings(prev => ({ ...prev, shippingZones: newZones }));
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-1 flex items-end justify-center">
                          <Button 
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newZones = shippingSettings.shippingZones.filter((_, i) => i !== index);
                              setShippingSettings(prev => ({ ...prev, shippingZones: newZones }));
                            }}
                            className="h-10"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-40">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (
                    <>
                      <Save size={16} className="mr-2" /> Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <form onSubmit={(e) => handleSubmit(e, 'payment')}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure your store's payment processing options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enableCashOnDelivery" 
                      name="enableCashOnDelivery"
                      checked={paymentSettings.enableCashOnDelivery}
                      onCheckedChange={(checked) => handleSwitchChange('enableCashOnDelivery', checked, 'payment')}
                    />
                    <Label htmlFor="enableCashOnDelivery">Enable Cash on Delivery</Label>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      id="enableRazorpay" 
                      name="enableRazorpay"
                      checked={paymentSettings.enableRazorpay}
                      onCheckedChange={(checked) => handleSwitchChange('enableRazorpay', checked, 'payment')}
                    />
                    <Label htmlFor="enableRazorpay">Enable Razorpay</Label>
                  </div>
                  
                  {paymentSettings.enableRazorpay && (
                    <div className="pl-8 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                          <Input 
                            id="razorpayKeyId" 
                            name="razorpayKeyId"
                            value={paymentSettings.razorpayKeyId}
                            onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                          <Input 
                            id="razorpayKeySecret" 
                            name="razorpayKeySecret"
                            type="password"
                            value={paymentSettings.razorpayKeySecret}
                            onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium mb-4">Additional Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enablePhonePe" 
                        name="enablePhonePe"
                        checked={paymentSettings.enablePhonePe}
                        onCheckedChange={(checked) => handleSwitchChange('enablePhonePe', checked, 'payment')}
                      />
                      <Label htmlFor="enablePhonePe">Enable PhonePe (Coming Soon)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableGooglePay" 
                        name="enableGooglePay"
                        checked={paymentSettings.enableGooglePay}
                        onCheckedChange={(checked) => handleSwitchChange('enableGooglePay', checked, 'payment')}
                      />
                      <Label htmlFor="enableGooglePay">Enable Google Pay (Coming Soon)</Label>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sandboxMode" 
                      name="sandboxMode"
                      checked={paymentSettings.sandboxMode}
                      onCheckedChange={(checked) => handleSwitchChange('sandboxMode', checked, 'payment')}
                    />
                    <Label htmlFor="sandboxMode">Use Sandbox/Test Mode</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-8">
                    Enable this for testing payments. No real transactions will be processed.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-40">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (
                    <>
                      <Save size={16} className="mr-2" /> Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <form onSubmit={(e) => handleSubmit(e, 'email')}>
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure email notifications and templates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input 
                      id="senderName" 
                      name="senderName"
                      value={emailSettings.senderName}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, senderName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender Email</Label>
                    <Input 
                      id="senderEmail" 
                      name="senderEmail"
                      type="email"
                      value={emailSettings.senderEmail}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-sm font-medium">SMTP Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        name="smtpHost"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        name="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input 
                        id="smtpUsername" 
                        name="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        name="smtpPassword"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableOrderConfirmationEmails" 
                        name="enableOrderConfirmationEmails"
                        checked={emailSettings.enableOrderConfirmationEmails}
                        onCheckedChange={(checked) => handleSwitchChange('enableOrderConfirmationEmails', checked, 'email')}
                      />
                      <Label htmlFor="enableOrderConfirmationEmails">Send Order Confirmation Emails</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableShippingUpdateEmails" 
                        name="enableShippingUpdateEmails"
                        checked={emailSettings.enableShippingUpdateEmails}
                        onCheckedChange={(checked) => handleSwitchChange('enableShippingUpdateEmails', checked, 'email')}
                      />
                      <Label htmlFor="enableShippingUpdateEmails">Send Shipping Update Emails</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableMarketingEmails" 
                        name="enableMarketingEmails"
                        checked={emailSettings.enableMarketingEmails}
                        onCheckedChange={(checked) => handleSwitchChange('enableMarketingEmails', checked, 'email')}
                      />
                      <Label htmlFor="enableMarketingEmails">Send Marketing Emails</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 border-t pt-6">
                  <Label htmlFor="emailFooter">Email Footer Text</Label>
                  <Textarea 
                    id="emailFooter" 
                    name="emailFooter"
                    rows={3}
                    value={emailSettings.emailFooter}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, emailFooter: e.target.value }))}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-40">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (
                    <>
                      <Save size={16} className="mr-2" /> Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Configure search engine optimization settings.</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">SEO configuration options coming soon</p>
                <p className="text-sm text-gray-400">This feature is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 