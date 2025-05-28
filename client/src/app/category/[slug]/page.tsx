"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/shared/ProductCard";
import DeliveryBanner from "@/components/shared/DeliveryBanner";
import { FilterIcon, ChevronDown, ChevronUp } from "lucide-react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState("recommended");
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(`/api/categories`);
        const cats = await catRes.json();
        const foundCat = cats.find((c: any) => c.slug === params.slug);
        setCategory(foundCat);
        if (foundCat) {
          const prodRes = await fetch(`/api/products?categoryId=${foundCat.id}`);
          const prods = await prodRes.json();
          setProducts(prods);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError('Could not load category or products');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [params.slug]);

  // Filter and sort products
  let displayProducts = [...products];
  displayProducts = displayProducts.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
  );
  if (sortOption === "price-low-high") {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high-low") {
    displayProducts.sort((a, b) => b.price - a.price);
  }

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
              <li className="text-gray-800">{category?.name}</li>
            </ol>
          </nav>
        </div>

        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{category?.name}</h1>
          <p className="text-gray-600">{category?.description}</p>
        </div>

        <DeliveryBanner />

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-lg text-gray-800 mb-4">Filters</h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-6"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Product Type */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Product Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="curry-cut"
                      className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                    />
                    <label htmlFor="curry-cut" className="ml-2 text-gray-700">
                      Curry Cut
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="boneless"
                      className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                    />
                    <label htmlFor="boneless" className="ml-2 text-gray-700">
                      Boneless
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mince"
                      className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                    />
                    <label htmlFor="mince" className="ml-2 text-gray-700">
                      Mince
                    </label>
                  </div>
                </div>
              </div>

              {/* Reset Filters Button */}
              <Button variant="outline" className="w-full border-tendercuts-red text-tendercuts-red hover:bg-tendercuts-red/10">
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle and Sort */}
            <div className="md:hidden flex justify-between mb-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FilterIcon size={16} />
                Filters
                {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filters (expandable) */}
            {filterOpen && (
              <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-6"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Product Type */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Product Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-curry-cut"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                      />
                      <label htmlFor="mobile-curry-cut" className="ml-2 text-gray-700">
                        Curry Cut
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-boneless"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                      />
                      <label htmlFor="mobile-boneless" className="ml-2 text-gray-700">
                        Boneless
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-mince"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                      />
                      <label htmlFor="mobile-mince" className="ml-2 text-gray-700">
                        Mince
                      </label>
                    </div>
                  </div>
                </div>

                {/* Apply Filters Button */}
                <Button className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90">
                  Apply Filters
                </Button>
              </div>
            )}

            {/* Desktop Sort Options */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {displayProducts.length} products
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check out our other categories.
                </p>
                <Link href="/">
                  <Button className="bg-tendercuts-red hover:bg-tendercuts-red/90">
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
