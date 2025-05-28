'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, User, Tag, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fallback blog post in case API fails
const fallbackBlogPost = {
  id: 'health-benefits',
  title: "Health Benefits of Seafood",
  image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop",
  slug: "health-benefits-of-seafood",
  excerpt: "Discover the amazing health benefits of including seafood in your regular diet.",
  category: "Health",
  author: "Dr. Ramanathan",
  date: "2023-06-15",
  content: `
    <p>Seafood is packed with essential nutrients that can improve your overall health. Rich in omega-3 fatty acids, high-quality protein, and various vitamins and minerals, seafood is one of the most nutritious foods you can include in your diet.</p>
    
    <h2>Omega-3 Fatty Acids</h2>
    <p>Fish and shellfish are excellent sources of omega-3 fatty acids, particularly EPA and DHA. These essential fatty acids are crucial for brain health, reducing inflammation, and supporting cardiovascular function.</p>
    
    <h2>Heart Health</h2>
    <p>Regular consumption of fish has been linked to a reduced risk of heart disease. The omega-3 fatty acids in fish can help lower blood pressure, reduce triglycerides, and prevent the build-up of plaque in arteries.</p>
    
    <h2>Brain Development</h2>
    <p>DHA, one of the omega-3 fatty acids found in seafood, is a major structural component of the brain. Consuming seafood during pregnancy and early childhood can support optimal brain development.</p>
    
    <h2>Rich in Nutrients</h2>
    <p>Seafood is an excellent source of high-quality protein, vitamins D and B2, and minerals like calcium, phosphorus, iron, zinc, iodine, magnesium, and potassium.</p>
  `,
  isActive: true
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [blogPost, setBlogPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to get image URL with fallback
  const getImageUrl = (post: any): string => {
    if (!post) return "https://images.unsplash.com/photo-1556269923-e4ef51d69638?q=80&w=2036&auto=format&fit=crop";
    
    // If image is available, use it
    if (post.image) {
      // Check if image is a full URL or just a path
      if (post.image.startsWith('http')) {
        return post.image;
      } else {
        // For local images, ensure they have the correct path
        return post.image.startsWith('/') ? post.image : `/${post.image}`;
      }
    }
    
    // Default fallback image for blog posts
    return "https://images.unsplash.com/photo-1556269923-e4ef51d69638?q=80&w=2036&auto=format&fit=crop";
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, you would fetch the specific blog post by slug
        // For now, we'll fetch all posts and find the one that matches the slug
        console.log("Fetching blog post with slug:", params.slug);
        const res = await fetch('/api/blog-posts');
        
        if (!res.ok) {
          console.warn(`API returned status: ${res.status}`);
          throw new Error(`Failed to fetch blog posts (Status: ${res.status})`);
        }
        
        const data = await res.json();
        console.log("Blog posts received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          const post = data.find((post: any) => 
            post.slug === params.slug || post.id === params.slug
          );
          
          if (post) {
            setBlogPost(post);
          } else {
            console.warn("Blog post not found with slug:", params.slug);
            
            // Use fallback if the post isn't found
            if (fallbackBlogPost.slug === params.slug || fallbackBlogPost.id === params.slug) {
              setBlogPost(fallbackBlogPost);
            } else {
              setError(`Blog post with slug "${params.slug}" not found`);
            }
          }
        } else {
          console.warn("Empty or invalid blog posts data, using fallback");
          if (fallbackBlogPost.slug === params.slug || fallbackBlogPost.id === params.slug) {
            setBlogPost(fallbackBlogPost);
          } else {
            setError(`Blog post with slug "${params.slug}" not found`);
          }
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError('Could not load blog post from API, using fallback data');
        
        if (fallbackBlogPost.slug === params.slug || fallbackBlogPost.id === params.slug) {
          setBlogPost(fallbackBlogPost);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [params.slug]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading blog post...</span>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !blogPost) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <p className="text-sm text-yellow-700">
              {error || "Blog post not found"}
            </p>
          </div>
          
          <Link href="/blog">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {blogPost.category}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          {blogPost.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{blogPost.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>{formatDate(blogPost.date)}</span>
          </div>
        </div>
        
        <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
          <Image 
            src={getImageUrl(blogPost)}
            alt={blogPost.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="prose prose-blue max-w-none mb-12">
          {blogPost.content ? (
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          ) : (
            <p className="text-gray-600">
              {blogPost.excerpt || "No content available for this blog post."}
            </p>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
          <p className="text-gray-600 mb-4">Explore more articles about seafood and healthy eating.</p>
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse All Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 