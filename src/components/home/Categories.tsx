"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Vangaram Fish",
    image: "/images/fish/vangaram.jpg",
    slug: "vangaram-fish",
    type: "Fish"
  },
  {
    id: 2,
    name: "Sliced Vangaram",
    image: "/images/fish/sliced-vangaram.jpg",
    slug: "sliced-vangaram",
    type: "Fish"
  },
  {
    id: 3,
    name: "Dried Fish",
    image: "/images/fish/dried-vangaram.webp",
    slug: "dried-fish",
    type: "Dried Fish"
  },
  {
    id: 4,
    name: "Jumbo Prawns",
    image: "/images/fish/big-prawn.webp",
    slug: "jumbo-prawns",
    type: "Prawns"
  },
  {
    id: 5,
    name: "Sea Prawns",
    image: "/images/fish/sea-prawn.webp",
    slug: "sea-prawns",
    type: "Prawns"
  },
  {
    id: 6,
    name: "Fresh Lobster",
    image: "/images/fish/lobster.jpg",
    slug: "fresh-lobster",
    type: "Shellfish"
  },
  {
    id: 7,
    name: "Blue Crabs",
    image: "/images/fish/blue-crabs.jpg",
    slug: "blue-crabs",
    type: "Crabs"
  },
  {
    id: 8,
    name: "Sea Crabs",
    image: "/images/fish/normal crabs.jpg",
    slug: "sea-crabs",
    type: "Crabs"
  },
  {
    id: 9,
    name: "Fresh Squid",
    image: "/images/fish/squid.jpg",
    slug: "fresh-squid",
    type: "Cephalopods"
  },
  {
    id: 10,
    name: "Fish Combo",
    image: "/images/fish/vareity-fishes.jpg",
    slug: "fish-combo",
    type: "Combo"
  }
];

const Categories = () => {
  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fresh Seafood Selection</h2>
          <p className="text-gray-600">Premium Quality Seafood Delivered Fresh!</p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center bg-tendercuts-red rounded-full p-2 w-10 h-10">
            <Image
              src="/images/delivery-icon.png"
              alt="Delivery Icon"
              width={20}
              height={20}
            />
          </div>
          <div className="ml-2">
            <p className="text-sm text-gray-600">Delivery in</p>
            <p className="font-medium">90 Minutes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.slug.startsWith('/') ? category.slug : `/category/${category.slug}`}
            className="group block"
          >
            <div className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-[4/3] relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {category.type}
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 group-hover:text-tendercuts-blue transition-colors">
                  {category.name}
                </h3>
                <span className="inline-block mt-1 text-xs text-gray-500">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
