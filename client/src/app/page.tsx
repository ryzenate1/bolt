import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import BlogPosts from "@/components/home/BlogPosts";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import AboutSection from "@/components/home/AboutSection";
import FreshDeliverySection from "@/components/home/FreshDeliverySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustBadgesSection from "@/components/home/TrustBadgesSection";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <HeroBanner />
        <div className="mb-2 sm:mb-3"></div>
        
        {/* Fresh Seafood Collection - Prominently displayed at the top */}
        <section 
          id="fresh-seafood-collection" 
          className="fresh-seafood-section mb-2 sm:mb-3 overflow-visible z-10 relative"
        >
          <TrustBadgesSection />
        </section>
        
        <div className="mb-2 sm:mb-3"></div>
        <Categories />
        <div className="mb-2 sm:mb-3"></div>
        <FeaturedProducts />
        <div className="mb-2 sm:mb-3"></div>
        <FreshDeliverySection />
        <div className="mb-2 sm:mb-3"></div>
        <SustainabilitySection />
        <div className="mb-2 sm:mb-3"></div>
        <BlogPosts />
        <div className="mb-2 sm:mb-3"></div>
        <AboutSection />
        <div className="mb-2 sm:mb-3"></div>
        <TestimonialsSection />
      </div>
    </div>
  );
}
