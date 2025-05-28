"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Italianno } from 'next/font/google';
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";
import { gsap } from "gsap";
import { textRevealAnimation, pathDrawAnimation } from "@/lib/animations";
import { FadeInImage } from "@/components/ui/fade-in-image";
import { AnimatedText } from "@/components/ui/animated-text";
import { ParallaxSection } from "@/components/ui/parallax-section";

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const HeroBanner = () => {
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const signatureTextRef = useRef<HTMLSpanElement>(null);
  const signaturePathRef = useRef<SVGPathElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const promisePathRef = useRef<SVGPathElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Check if element is in view for triggering animations
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Parallax effect for the background image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  
  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Initialize animations when component mounts and image is loaded
  useEffect(() => {
    if (!isInView || !imageLoaded) return;
    
    // Fluid animation sequence for professional appearance
    const animationSequence = async () => {
      // Create a smooth staggered animation timeline
      const tl = gsap.timeline();
      
      // Animate welcome text with GSAP - fluid slide-in animation
      if (welcomeTextRef.current) {
        tl.fromTo(welcomeTextRef.current, 
          { opacity: 0, x: -30, y: 10 },
          { opacity: 1, x: 0, y: 0, duration: 1, ease: "expo.out" },
          0
        );
      }
      
      // Animate main title with impressive reveal
      if (mainTitleRef.current) {
        // Split text for character-by-character animation
        const text = mainTitleRef.current.textContent || '';
        mainTitleRef.current.innerHTML = '';
        mainTitleRef.current.style.opacity = '1';
        
        // Create character spans
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.opacity = '0';
          span.style.display = 'inline-block';
          span.style.transform = 'translateY(20px)';
          mainTitleRef.current?.appendChild(span);
          
          // Animate each character with staggered delay
          gsap.to(span, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.2)",
            delay: 0.5 + (i * 0.04)
          });
        });
      }
      
      // Animate signature text with fluid motion
      if (signatureTextRef.current) {
        tl.fromTo(signatureTextRef.current, 
          { opacity: 0, scale: 0.9, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.75)" },
          0.8
        );
      }
      
      // Animate signature path with smooth drawing
      if (signaturePathRef.current) {
        tl.fromTo(signaturePathRef.current,
          { strokeDashoffset: signaturePathRef.current.getTotalLength() },
          { strokeDashoffset: 0, duration: 1.2, ease: "power3.inOut" },
          0.9
        );
      }
      
      // Animate description with fluid reveal
      if (descriptionRef.current) {
        tl.fromTo(descriptionRef.current,
          { opacity: 0, y: 20, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          { 
            opacity: 1, 
            y: 0, 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', 
            duration: 0.8, 
            ease: "power3.out" 
          },
          1.1
        );
      }
      
      // Animate promise underline with smooth drawing
      if (promisePathRef.current) {
        tl.fromTo(promisePathRef.current,
          { strokeDashoffset: promisePathRef.current.getTotalLength() },
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
          1.4
        );
      }
      
      // Animate button with smooth reveal
      if (buttonRef.current) {
        tl.fromTo(buttonRef.current,
          { opacity: 0, y: 15, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.5)" },
          1.5
        );
      }
    };
    
    // Start the animation sequence
    animationSequence();
    
    // Trigger Framer Motion animations with more subtle settings
    controls.start("visible");
    
  }, [isInView, controls]);
  
  return (
    <div className="relative w-full" ref={containerRef}>
      <motion.div 
        className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div style={{ y, position: 'absolute', width: '100%', height: '100%' }}>
          <Image
            src="/images/bg.jpg"
            alt="Kadal Thunai Fresh Seafood"
            fill
            className="object-cover object-center"
            priority
            onLoad={handleImageLoad}
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-50 sm:bg-opacity-40 flex items-start pt-10 sm:pt-16 md:pt-24"
          style={{ opacity }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <div className="mb-4">
                <h1 
                  ref={welcomeTextRef}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                  data-component-name="HeroBanner"
                >
                  Welcome To,
                </h1>
                <h1 
                  ref={mainTitleRef}
                  className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-tendercuts-red"
                  data-component-name="HeroBanner"
                >
                  Kadal Thunai.
                </h1>
                <div className="relative inline-block mt-1">
                  <span 
                    ref={signatureTextRef}
                    className={`${italianno.className} relative z-10 text-3xl sm:text-4xl md:text-5xl text-white`}
                    data-component-name="HeroBanner"
                  >
                    SignatureCuts
                  </span>
                  <div className="relative w-full mt-0">
                    <svg 
                      className="w-full h-3 sm:h-4" 
                      viewBox="0 0 300 25" 
                      preserveAspectRatio="none"
                      data-component-name="HeroBanner"
                    >
                      <path 
                        ref={signaturePathRef}
                        d="M0,18 C30,8 70,28 120,13 C170,-2 210,18 260,8 C310,-2 350,18 400,13" 
                        fill="none" 
                        className="text-tendercuts-red" 
                        stroke="currentColor" 
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        data-component-name="HeroBanner"
                      />
                    </svg>
                  </div>
                </div>
                <p 
                  ref={descriptionRef}
                  className="text-base sm:text-lg md:text-xl mt-4 sm:mt-6 text-white font-medium"
                >
                  No matter what we always serves fresh. 
                  <span className="relative ml-1">
                    <span className="relative z-10 font-bold">Promise!!</span>
                    <svg 
                      className="absolute -bottom-2.5 left-0 w-full h-3 sm:h-4" 
                      viewBox="0 0 100 25" 
                      preserveAspectRatio="none"
                      data-component-name="HeroBanner"
                    >
                      <path 
                        ref={promisePathRef}
                        d="M0,18 C15,8 35,28 50,13 C65,-2 85,18 100,8" 
                        fill="none" 
                        className="text-tendercuts-red" 
                        stroke="currentColor" 
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        data-component-name="HeroBanner"
                      />
                    </svg>
                  </span>
                </p>
              </div>
              <div data-component-name="MotionComponent">
                <Button 
                  ref={buttonRef}
                  className="bg-tendercuts-red hover:bg-tendercuts-red-dark text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 mt-2 transition-colors duration-200"
                  data-component-name="_c"
                >
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
