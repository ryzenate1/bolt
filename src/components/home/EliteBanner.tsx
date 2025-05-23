"use client";

import Image from "next/image";

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm flex flex-col items-center text-center">
    <div className="w-16 h-16 mb-3 flex items-center justify-center">
      <Image
        src={icon}
        alt={title}
        width={64}
        height={64}
        className="w-full h-full object-contain"
      />
    </div>
    <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const EliteBanner = () => {
  const features = [
    {
      icon: "/images/fssi.png",
      title: "FSSAI Certified",
      description: "100% quality certified products"
    },
    {
      icon: "https://img.icons8.com/color/96/000000/free-shipping.png",
      title: "Free Delivery",
      description: "On orders above ₹499 within 5km radius"
    },
    {
      icon: "https://img.icons8.com/color/96/000000/price-tag.png",
      title: "Lowest Price",
      description: "Best price guaranteed"
    }
  ];

  return (
    <div className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default EliteBanner;
