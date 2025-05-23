"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Italianno } from 'next/font/google';

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const HeroBanner = () => {
  return (
    <div className="relative w-full">
      <div className="relative w-full h-[500px] overflow-hidden">
        <Image
          src="/images/bg.jpg"
          alt="Kadal Thunai Fresh Seafood"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-start pt-16 md:pt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Welcome To,
                </h1>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight text-tendercuts-red">
                  Kadal Thunai.
                </h1>
                <div className="relative inline-block mt-1">
                  <span className={`${italianno.className} relative z-10 text-4xl md:text-5xl text-white`}>
                    SignatureCuts
                  </span>
                  <div className="relative w-full mt-1">
                    <svg 
                      className="w-full h-3" 
                      viewBox="0 0 300 20" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,15 C30,5 70,25 120,10 C170,-5 210,15 260,5 C310,-5 350,15 400,10" 
                        fill="none" 
                        className="text-tendercuts-red" 
                        stroke="currentColor" 
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-lg md:text-xl mt-6 text-white font-medium">
                  No matter what we always serves fresh. 
                  <span className="relative">
                    <span className="relative z-10">Promise</span>
                    <svg 
                      className="absolute -bottom-1 left-0 w-full h-3" 
                      viewBox="0 0 100 20" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,15 C15,5 35,25 50,10 C65,-5 85,15 100,5" 
                        fill="none" 
                        className="text-tendercuts-red" 
                        stroke="currentColor" 
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </span>
                </p>
              </div>
              <Button className="bg-tendercuts-red hover:bg-tendercuts-red-dark text-lg px-8 py-6 mt-2">
                SHOP NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
