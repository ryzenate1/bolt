"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart } from "lucide-react";
import TopPicks from "@/components/home/TopPicks";
import DeliveryBanner from "@/components/shared/DeliveryBanner";

// Fetch product data from API
async function getProductData(slug: string) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch product data');
  }
  return res.json();
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductData(params.slug);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.slug]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading product details...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8 text-center">Product not found.</div>;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-tendercuts-red">
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link href="/category/chicken" className="text-gray-500 hover:text-tendercuts-red">
                  Chicken
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-800">{product.name}</li>
            </ol>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

              <div className="text-sm text-gray-600 mb-4">
                {product.pieces && <div className="mb-1">{product.pieces}</div>}
                {product.weight && <div className="mb-1">{product.weight}</div>}
              </div>

              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-gray-800">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <DeliveryBanner />

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Benefits:</h3>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 flex-shrink-0 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Storage Instructions */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Storage Instructions:</h3>
                <p className="text-gray-700">{product.storageInstructions}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="text-gray-800 mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-1 text-gray-800 font-medium border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button className="flex-1 bg-tendercuts-red hover:bg-tendercuts-red/90">
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1 border-tendercuts-red text-tendercuts-red hover:bg-tendercuts-red/10">
                  <Heart size={16} className="mr-2" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You may also like</h2>
          <TopPicks />
        </div>
      </div>
    </div>
  );
}
