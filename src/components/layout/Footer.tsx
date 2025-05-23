import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">COMPANY</h3>
            <ul className="space-y-2">
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
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">STAY CONNECTED</h3>
            <ul className="space-y-2">
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
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">LINKS</h3>
            <ul className="space-y-2">
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
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">DOWNLOAD OUR APP</h3>
            <div className="space-y-3">
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

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TenderCuts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
