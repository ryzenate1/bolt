import React from 'react';
import Image from 'next/image';

const SustainabilitySection = () => {
  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-tendercuts-red mb-6">Sustainably Sourced Seafood</h2>
            <p className="text-gray-700 mb-6">
              At Kadal Thunai, we're committed to protecting our oceans and supporting local fishing communities. 
              All our seafood is sustainably sourced, ensuring that marine ecosystems remain healthy for generations to come.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tendercuts-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Responsible Fishing Practices</h3>
                  <p className="text-gray-600">We work with fishermen who use selective fishing methods that minimize bycatch and habitat damage.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tendercuts-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Supporting Local Communities</h3>
                  <p className="text-gray-600">We source directly from local fishing communities, ensuring fair compensation and sustainable livelihoods.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tendercuts-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Eco-Friendly Packaging</h3>
                  <p className="text-gray-600">Our packaging is made from biodegradable and recyclable materials to reduce environmental impact.</p>
                </div>
              </div>
            </div>
            
            <button className="mt-8 bg-tendercuts-red hover:bg-tendercuts-red-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
              Learn More About Our Practices
            </button>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2 relative h-80 w-full lg:h-96">
            <div className="bg-gray-200 absolute inset-0 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sustainability Image</span>
            </div>
            {/* Uncomment when image is available */}
            {/* <Image 
              src="/images/sustainability.jpg" 
              alt="Sustainable fishing practices" 
              fill
              className="object-cover rounded-lg"
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
