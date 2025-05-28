"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Why Vanjaram fish is considered one of the healthiest seafood choices?",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop&w=800",
    slug: "vanjaram-fish-health-benefits",
    readTime: "4 min read",
    category: "Health Benefits",
    description: "Discover why Vanjaram fish is packed with essential nutrients and how it can benefit your health."
  },
  {
    id: 2,
    title: "Sustainable Fishing: How Kadal Thunai Sources the Freshest Catch",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop&w=800",
    slug: "sustainable-fishing",
    readTime: "5 min read",
    category: "Sustainability",
    description: "Learn about our commitment to sustainable fishing practices and how we ensure the freshest catch."
  },
  {
    id: 3,
    title: "The Health Benefits of Omega-3 Rich Seafood",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&w=800",
    slug: "omega3-benefits",
    readTime: "6 min read",
    category: "Nutrition",
    description: "Explore the numerous health benefits of including omega-3 rich seafood in your diet."
  },
];

const BlogSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">LATEST STORIES</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">From Our Seafood Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover recipes, cooking tips, and the latest in sustainable seafood</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="relative aspect-[16/9] bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={post.id === 1}
                />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded">
                    {post.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-5 flex-grow flex flex-col">
                <div className="flex-grow">
                  <span className="text-xs font-medium text-blue-600">{post.category}</span>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-semibold text-gray-900 mt-1 mb-2 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {post.description || 'Discover the benefits and recipes in our latest blog post.'}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    Read more
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 py-2"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
