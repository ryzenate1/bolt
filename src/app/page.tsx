import HeroBanner from "@/components/home/HeroBanner";
import EliteBanner from "@/components/home/EliteBanner";
import Categories from "@/components/home/Categories";
import TopPicks from "@/components/home/TopPicks";
import BlogSection from "@/components/home/BlogSection";
import VideoSection from "@/components/home/VideoSection";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <HeroBanner />
        <EliteBanner />
        <Categories />
        <TopPicks />
        <BlogSection />
        <VideoSection />
        <AboutSection />
      </div>
    </div>
  );
}
