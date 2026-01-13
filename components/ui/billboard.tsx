"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Billboard = () => {
  const baseUrl =
    "https://kemal-web-storage.s3.eu-north-1.amazonaws.com/bg3.png";

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <div
        style={{
          backgroundImage: `url(${baseUrl})`,
        }}
        className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover bg-center group"
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-6 relative z-10 px-6">
          <div className="font-bold text-4xl sm:text-6xl lg:text-7xl sm:max-w-xl max-w-xs text-white drop-shadow-md">
            Discover Your Style
          </div>
          <p className="text-white text-lg sm:text-xl font-medium drop-shadow-sm max-w-lg">
            Explore our latest collection of premium fashion designed for you.
          </p>
          <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 gap-2 font-semibold">
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
