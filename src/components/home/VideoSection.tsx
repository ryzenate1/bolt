"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

const videos = [
  {
    id: 1,
    thumbnail: "/images/videos/video-1.jpeg",
    title: "How to make perfect Chicken Biryani with TenderCuts",
    videoId: "abc123",
  },
  {
    id: 2,
    thumbnail: "/images/videos/video-2.jpeg",
    title: "Seafood recipes you'll love",
    videoId: "def456",
  },
  {
    id: 3,
    thumbnail: "/images/videos/video-3.jpeg",
    title: "Why TenderCuts meat is the best choice",
    videoId: "ghi789",
  },
  {
    id: 4,
    thumbnail: "/images/videos/video-4.jpeg",
    title: "How we ensure freshness in every delivery",
    videoId: "jkl012",
  },
  {
    id: 5,
    thumbnail: "/images/videos/video-5.jpeg",
    title: "Top mutton recipes to try this weekend",
    videoId: "mno345",
  },
];

const VideoSection = () => {
  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Youtube Videos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-video group cursor-pointer">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={24} className="text-tendercuts-red ml-1" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
