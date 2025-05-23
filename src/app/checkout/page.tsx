"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CreditCard, Banknote, Wallet, ChevronRight, Clock } from "lucide-react";

// Mock cart data - in a real app, this would come from a state management system
const cartItems = [
  {
    id: 1,
    name: "Chicken Curry Cut (Skin Off) - 1 Kg",
    image: "/images/products/chicken-curry-cut.jpeg",
    price: 309,
    quantity: 1,
    weight: "960 - 1000 Gms",
  },
  {
    id: 2,
    name: "Prawns Medium - Deshelled",
    image: "/images/products/prawns.webp",
    price: 215,
    quantity: 2,
    weight: "Gross: 480 - 500 Gms | Net: 240 - 270 Gms",
  },
];

// Mock saved addresses
const savedAddresses = [
  {
    id: 1,
    name: "Home",
    address: "123 Main Street, Apt 4B",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    phone: "9876543210",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    address: "456 Work Plaza, 2nd Floor",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600002",
    phone: "9876543211",
    isDefault: false,
  },
];

// Delivery time slots
const timeSlots = [
  { id: 1, slot: "10:00 AM - 12:00 PM" },
  { id: 2, slot: "12:00 PM - 2:00 PM" },
  { id: 3, slot: "2:00 PM - 4:00 PM" },
  { id: 4, slot: "4:00 PM - 6:00 PM" },
  { id: 5, slot: "6:00 PM - 8:00 PM" },
];

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("online");

  // Calculate order details
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = 0; // No discount in this example
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Checkout Sections */}
          <div className="flex-1 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="mr-2 text-tendercuts-red" />
                Delivery Address
              </h2>

              {!showAddressForm ? (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 ${
                        selectedAddress === address.id
                          ? "border-tendercuts-red"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          id={`address-${address.id}`}
                          name="delivery-address"
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="mt-1 h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                        />
                        <label
                          htmlFor={`address-${address.id}`}
                          className="ml-3 cursor-pointer flex-1"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium text-gray-800">
                                {address.name}
                              </span>
                              {address.isDefault && (
                                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-tendercuts-red hover:text-tendercuts-red/80 py-0 px-2 h-auto"
                            >
                              Edit
                            </Button>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {address.address}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-gray-600 mt-1">Phone: {address.phone}</p>
                        </label>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full border-dashed border-gray-300 hover:border-tendercuts-red hover:text-tendercuts-red mt-3"
                    onClick={() => setShowAddressForm(true)}
                  >
                    + Add New Address
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-4 border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="address-type"
                            value="home"
                            defaultChecked
                            className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                          />
                          <span className="ml-2 text-gray-700">Home</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="address-type"
                            value="office"
                            className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                          />
                          <span className="ml-2 text-gray-700">Office</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="address-type"
                            value="other"
                            className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                          />
                          <span className="ml-2 text-gray-700">Other</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input placeholder="Your Full Name" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input placeholder="10-digit mobile number" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pin Code
                      </label>
                      <Input placeholder="6-digit pincode" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Input placeholder="House No, Building, Street, Area" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Input placeholder="City" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <Input placeholder="State" />
                    </div>

                    <div className="md:col-span-2 flex items-center mt-2">
                      <input
                        type="checkbox"
                        id="default-address"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                      />
                      <label htmlFor="default-address" className="ml-2 text-gray-700">
                        Make this my default address
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
                      Save Address
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Time Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 text-tendercuts-red" />
                Delivery Time
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`border rounded-lg p-3 cursor-pointer ${
                      selectedTimeSlot === slot.id
                        ? "border-tendercuts-red bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedTimeSlot(slot.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`slot-${slot.id}`}
                        name="delivery-slot"
                        checked={selectedTimeSlot === slot.id}
                        onChange={() => setSelectedTimeSlot(slot.id)}
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                      />
                      <label
                        htmlFor={`slot-${slot.id}`}
                        className="ml-3 cursor-pointer flex-1 text-gray-700"
                      >
                        {slot.slot}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCard className="mr-2 text-tendercuts-red" />
                Payment Method
              </h2>

              <Tabs
                defaultValue="online"
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="online">Cards & UPI</TabsTrigger>
                  <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet</TabsTrigger>
                </TabsList>

                <TabsContent value="online" className="space-y-4">
                  <div className="border rounded-lg p-4 border-gray-200">
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        id="payment-card"
                        name="payment-online"
                        defaultChecked
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                      />
                      <label htmlFor="payment-card" className="ml-3 flex items-center">
                        <span className="text-gray-700 mr-2">Credit / Debit Card</span>
                        <div className="flex space-x-1">
                          <Image
                            src="/images/visa.png"
                            alt="Visa"
                            width={24}
                            height={16}
                          />
                          <Image
                            src="/images/mastercard.png"
                            alt="Mastercard"
                            width={24}
                            height={16}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="ml-7 space-y-3">
                      <Input placeholder="Card Number" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="MM / YY" />
                        <Input placeholder="CVV" />
                      </div>
                      <Input placeholder="Name on Card" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-upi"
                        name="payment-online"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                      />
                      <label htmlFor="payment-upi" className="ml-3 flex items-center">
                        <span className="text-gray-700 mr-2">UPI</span>
                        <div className="flex space-x-1">
                          <Image
                            src="/images/gpay.png"
                            alt="Google Pay"
                            width={24}
                            height={24}
                          />
                          <Image
                            src="/images/phonepe.png"
                            alt="PhonePe"
                            width={24}
                            height={24}
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-netbanking"
                        name="payment-online"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red"
                      />
                      <label htmlFor="payment-netbanking" className="ml-3">
                        <span className="text-gray-700">Net Banking</span>
                      </label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cod">
                  <div className="border rounded-lg p-4 border-gray-200">
                    <div className="flex items-start">
                      <Banknote className="mt-1 h-5 w-5 text-tendercuts-red" />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">Cash on Delivery</h3>
                        <p className="text-gray-600 text-sm">
                          Pay with cash when your order is delivered.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="wallet">
                  <div className="border rounded-lg p-4 border-gray-200">
                    <div className="flex items-start">
                      <Wallet className="mt-1 h-5 w-5 text-tendercuts-red" />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">TenderCuts Wallet</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Available Balance: ₹0.00
                        </p>
                        <Button
                          className="bg-tendercuts-red hover:bg-tendercuts-red/90"
                          size="sm"
                        >
                          Add Money
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h2 className="font-semibold text-lg text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      <p className="text-gray-800 font-medium">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3 mb-3"></div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-800">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3"></div>

                <div className="flex justify-between text-gray-800 font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-tendercuts-red hover:bg-tendercuts-red/90"
              >
                Place Order
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our{" "}
                <Link href="/terms-and-conditions" className="text-tendercuts-red hover:underline">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
