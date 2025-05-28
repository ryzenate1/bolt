import React from 'react';
import Image from 'next/image';

const FreshDeliverySection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 relative h-80 w-full lg:h-96">
            <div className="bg-gray-200 absolute inset-0 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Delivery Image</span>
            </div>
            {/* Uncomment when image is available */}
            {/* <Image 
              src="/images/fresh-delivery.jpg" 
              alt="Fresh seafood delivery" 
              fill
              className="object-cover rounded-lg"
            /> */}
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-tendercuts-red mb-6">Fresh Delivery, From Ocean to Table</h2>
            <p className="text-gray-700 mb-6">
              We believe that the freshest seafood makes for the most delicious meals. That's why we've built a 
              lightning-fast supply chain that brings seafood from the ocean to your table in record time.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tendercuts-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Same-Day Delivery</h3>
                  <p className="text-gray-600">Order before 2 PM for same-day delivery in select areas.</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tendercuts-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Temperature-Controlled Packaging</h3>
                  <p className="text-gray-600">Our specialized packaging keeps seafood at the optimal temperature.</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tendercuts-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Freshness Guarantee</h3>
                  <p className="text-gray-600">If you're not 100% satisfied with the freshness, we'll refund you.</p>
                </div>
              </div>
            </div>
            
            <button className="mt-8 bg-tendercuts-red hover:bg-tendercuts-red-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
              Check Delivery in Your Area
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreshDeliverySection;
