"use client";

"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Home Chef",
      quote: "The quality of seafood from Kadal Thunai is exceptional. I can always trust that I'm getting the freshest fish for my family meals.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Restaurant Owner",
      quote: "As a restaurant owner, consistency is key. Kadal Thunai delivers consistently fresh seafood that my customers love. Their delivery is always on time.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Anita Desai",
      role: "Food Blogger",
      quote: "I've tried many seafood delivery services, but none compare to Kadal Thunai. Their sustainable practices and premium quality make them stand out.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      name: "Arjun Patel",
      role: "Food Enthusiast",
      quote: "The variety of seafood options is incredible. I love how fresh everything is, and the delivery is super fast!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
    }
  ];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  useEffect(() => {
    setIsMounted(true);
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    
    // Set initial value
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  // Responsive settings
  const itemsPerPage = isMobile ? 1 : 3;
  
  // Get current testimonials to show
  const getCurrentTestimonials = () => {
    if (!isMounted) return [];
    
    if (isMobile) {
      return [testimonials[currentIndex % testimonials.length]];
    }
    // For desktop, show 3 testimonials at a time
    const endIndex = (currentIndex + itemsPerPage) % testimonials.length;
    if (endIndex > currentIndex) {
      return testimonials.slice(currentIndex, endIndex);
    }
    return [...testimonials.slice(currentIndex), ...testimonials.slice(0, endIndex)];
  };
  
  const currentTestimonials = getCurrentTestimonials();
  
  // Don't render anything until we know if we're on mobile or not
  if (!isMounted) return null;

  return (
    <section ref={containerRef} className="py-12 md:py-20 bg-gradient-to-b from-white to-red-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-tendercuts-red mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Don't just take our word for it. Here's what our customers have to say about their Kadal Thunai experience.
          </p>
        </motion.div>
        
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-tendercuts-red w-6' : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-tendercuts-red" />
              </button>
              <span className="text-sm text-gray-600">Swipe to view more</span>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-tendercuts-red" />
              </button>
            </div>
          </div>
        )}
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {currentTestimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
              >
                <div className="flex-1">
                  <Quote className="h-8 w-8 text-tendercuts-red/20 mb-4" />
                  <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
                
                <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-tendercuts-red/20">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover h-full w-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className="h-4 w-4 text-yellow-400" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {!isMobile && (
            <div className="flex justify-center mt-10 space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-5 w-5 text-tendercuts-red" />
              </button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * 3)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentIndex === index * 3 ? 'bg-tendercuts-red w-4' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial set ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-5 w-5 text-tendercuts-red" />
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/testimonials" 
            className="inline-flex items-center text-tendercuts-red hover:text-tendercuts-red/80 font-medium transition-colors group"
          >
            Read More Customer Reviews
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
