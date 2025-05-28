"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";

const Footer = () => {
  // For mobile accordion functionality
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };
  
  // Shop location
  const shopLocation = {
    address: "123 Nungambakkam High Road, Chennai, Tamil Nadu 600034",
    coordinates: {
      lat: 13.0569,
      lng: 80.2425
    }
  };
  
  return (
    <footer className="bg-white border-t pt-10 pb-20 md:pb-6"> {/* Added more bottom padding on mobile for nav */}
      <div className="container mx-auto px-4">
        {/* Store Location Map */}
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
            <MapPin className="mr-2 text-tendercuts-red" /> Our Main Store
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <p className="text-gray-600 mb-2">{shopLocation.address}</p>
              <p className="text-gray-600 mb-4">Phone: 9543754375</p>
              <div className="text-sm text-gray-500">
                <p className="mb-1">Mon-Sat: 7:00 AM - 9:00 PM</p>
                <p>Sunday: 7:00 AM - 7:00 PM</p>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62213.25333188237!2d80.20271984863285!3d13.056563499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1652363026215!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* Footer links - Desktop view (grid) and Mobile view (accordion) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Section */}
          <div className="space-y-4">
            <h3 
              className="font-bold text-gray-800 uppercase text-sm tracking-wider flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('company')}
            >
              COMPANY
              <span className="md:hidden">
                {openSection === 'company' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </h3>
            <ul className={`space-y-2 ${openSection === 'company' ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-tendercuts-red transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-600 hover:text-tendercuts-red transition">
                  Terms and Condition
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-tendercuts-red transition">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Connected Section */}
          <div className="space-y-4">
            <h3 
              className="font-bold text-gray-800 uppercase text-sm tracking-wider flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('connected')}
            >
              STAY CONNECTED
              <span className="md:hidden">
                {openSection === 'connected' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </h3>
            <ul className={`space-y-2 ${openSection === 'connected' ? 'block' : 'hidden md:block'}`}>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <a href="mailto:cs@tendercuts.in" className="text-gray-600 hover:text-tendercuts-red transition">
                  cs@tendercuts.in
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-600">Chennai - 9543754375</span>
              </li>
              <li className="flex items-center space-x-2">
                <Facebook size={16} className="text-gray-500" />
                <a
                  href="https://www.facebook.com/pg/TenderCutsIN/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-tendercuts-red transition"
                >
                  Facebook
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Twitter size={16} className="text-gray-500" />
                <a
                  href="https://twitter.com/TenderCutsIN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-tendercuts-red transition"
                >
                  Twitter
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram size={16} className="text-gray-500" />
                <a
                  href="https://www.instagram.com/tendercuts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-tendercuts-red transition"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 
              className="font-bold text-gray-800 uppercase text-sm tracking-wider flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('links')}
            >
              LINKS
              <span className="md:hidden">
                {openSection === 'links' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </h3>
            <ul className={`space-y-2 ${openSection === 'links' ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link href="/store-locator" className="text-gray-600 hover:text-tendercuts-red transition">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-600 hover:text-tendercuts-red transition">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/why-tendercuts" className="text-gray-600 hover:text-tendercuts-red transition">
                  Why TenderCuts?
                </Link>
              </li>
              <li>
                <Link href="/quality-check" className="text-gray-600 hover:text-tendercuts-red transition">
                  Quality Check
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-gray-600 hover:text-tendercuts-red transition">
                  Certificates
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/jobs/search/?f_C=10808026&location=India&originalSubdomain=in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-tendercuts-red transition"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile App Download Section */}
          <div className="space-y-4">
            <h3 
              className="font-bold text-gray-800 uppercase text-sm tracking-wider flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('app')}
            >
              DOWNLOAD OUR APP
              <span className="md:hidden">
                {openSection === 'app' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </h3>
            <div className={`space-y-3 ${openSection === 'app' ? 'block' : 'hidden md:block'}`}>
              <a
                href="https://itunes.apple.com/in/app/tendercuts-farm-fresh-meat-and-fresh-fish/id1236186604?mt=8"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/images/app-store.png"
                  alt="Download on App Store"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.tendercuts.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/images/play-store.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} TenderCuts. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-tendercuts-red transition">Cookie Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-gray-600 hover:text-tendercuts-red transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
