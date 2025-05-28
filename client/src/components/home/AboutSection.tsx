"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { AnimatedText } from "@/components/ui/animated-text";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ParallaxSection } from "@/components/ui/parallax-section";

const accordionItems = [
  {
    id: "freshly-cut",
    title: "Freshly cut, freshly packed meat delivered to your doorstep",
    content: "Your search for farm-fresh, high-quality meat ends with TenderCuts. Order the best, locally-sourced mutton, chicken, eggs, fish and seafood from your friendly neighbourhood meat store TenderCuts. Enjoy lightning-fast home delivery on every order. Order meat online with TenderCuts to whip up a feast fit for a king."
  },
  {
    id: "deliciousness",
    title: "Deliciousness in every bite",
    content: "TenderCuts offers a vast catalogue of fresh and juicy meat products online. Whether you wish to place an order for fresh meat delivery or an assortment of lip-smacking cold cuts, non-veg snacks, pickles, dressings, and spices, you can find it all. At TenderCuts, we also offer a range of scrumptious ready-to-cook, freshly marinated meat products with authentic flavours. Also, sample our all-in-one Chicken and Mutton Biryani Kits to satiate those Biryani cravings in minutes."
  },
  {
    id: "freshness-tracker",
    title: "Our Freshness Tracker Guarantees Fresh meat delivery",
    content: "At TenderCuts, we do not believe in pre-packaging meats. We begin processing the order from cleaning and cutting to packing the meat in vacuum-sealed bags only after you place the order. Whats more, you can track your order every step of the way with the TenderCuts Freshness Tracker built into our meat online delivery app."
  },
  {
    id: "download-app",
    title: "Download the TenderCuts App",
    content: "Placing your meat online delivery order is as easy as one, two, three. Download the TenderCuts App on your smartphone. Browse through our extensive range of fresh meat products, add them to your cart and place your order after choosing your preferred payment mode. Sit back and relax until we deliver it to your doorstep or track it in real-time on the app. Now you can order meat online and choose your preferred delivery slot. Enjoy exclusive discounts and deals on every TenderCuts order."
  },
];

const AboutSection = () => {
  const [openItem, setOpenItem] = useState("freshly-cut");

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? "" : id);
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  return (
    <div className="my-10" ref={sectionRef}>
      <AnimatedSection direction="up" delay={0.1}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <AnimatedText 
            text="Kadal Thunai Fresh Seafood & Fish" 
            tag="span"
            delay={0.2}
          />
        </h2>
      </AnimatedSection>

      <div className="space-y-4">
        {accordionItems.map((item, index) => (
          <AnimatedSection 
            key={item.id} 
            className="w-full" 
            direction="up" 
            delay={0.2 + (index * 0.1)}
          >
            <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <button
                className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                <motion.div 
                  className="flex-shrink-0 ml-2"
                  animate={{ rotate: openItem === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/expand-icon.png"
                    alt={openItem === item.id ? "Collapse" : "Expand"}
                    width={16}
                    height={16}
                  />
                </motion.div>
              </button>
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openItem === item.id ? "auto" : 0,
                  opacity: openItem === item.id ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{item.content}</p>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
