"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  originalPrice?: number;
  quantity: string;
  pieces?: string;
  weight?: string;
  slug: string;
}

const ProductCard = ({
  id,
  name,
  image,
  description,
  price,
  originalPrice,
  quantity,
  pieces,
  weight,
  slug,
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3">
      <Link href={`/product/${slug}`}>
        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/product/${slug}`}>
          <h3 className="font-medium text-gray-800 hover:text-tendercuts-red transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {pieces && (
          <div className="text-xs text-gray-600">{pieces}</div>
        )}

        {weight && (
          <div className="flex items-center text-xs text-gray-600">
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V21M9 3.5L9 20.5M15 3.5L15 20.5M5.5 4L5.5 20M18.5 4L18.5 20M3.5 8H20.5M3.5 16H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {weight}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <span className="text-gray-800 font-semibold">₹{price}</span>
          {originalPrice && (
            <span className="text-gray-500 text-sm line-through">₹{originalPrice}</span>
          )}
        </div>

        <Button className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90 text-white">
          Add
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
