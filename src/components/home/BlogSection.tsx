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
    image: "/images/blog/vanjaram-fish.jpeg",
    slug: "vanjaram-fish-health-benefits",
  },
  {
    id: 2,
    title: "Why TenderCuts Ensures the Freshest Meat & Seafood for Customers",
    image: "/images/blog/fresh-meat.png",
    slug: "tendercuts-ensures-freshest-meat",
  },
  {
    id: 3,
    title: "The Health Benefits of Choosing Freshly Cut Meat Over Frozen Alternatives",
    image: "/images/blog/fresh-vs-frozen.jpeg",
    slug: "fresh-vs-frozen-meat",
  },
];

const BlogSection = () => {
  return (
    <div className="my-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Our Blog</h2>
        <Button variant="ghost" className="text-tendercuts-red flex items-center gap-2">
          KNOW MORE <ArrowRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-[5/3]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-medium text-gray-800 hover:text-tendercuts-red transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
