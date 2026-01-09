"use client";

import NextImage from "next/image";
import { Tab } from "@headlessui/react";

import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: string[];
}

// Upgrade Meesho image URL to higher resolution
const upgradeImageResolution = (url: string): string => {
  if (!url) return '';

  // Handle malformed URLs (concatenated URLs like "https://...https://...")
  const httpsIndex = url.indexOf('https://', 1);
  const httpIndex = url.indexOf('http://', 1);

  if (httpsIndex > 0) {
    url = url.substring(httpsIndex);
  } else if (httpIndex > 0) {
    url = url.substring(httpIndex);
  }

  // If not a proper URL, add base URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const baseUrl = "https://kemal-web-storage.s3.eu-north-1.amazonaws.com";
    return `${baseUrl}${url}`;
  }

  // For Meesho images: upgrade _512 to _1200 and remove width query param
  if (url.includes('images.meesho.com')) {
    // Remove ?width=XXX query parameter
    url = url.replace(/\?width=\d+/, '');
    // Upgrade _512 to _1200 for higher resolution
    url = url.replace(/_512\./, '_1200.');
  }

  return url;
};

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-2xl">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image, index) => (
            <GalleryTab image={image} key={index} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image, index) => (
          <Tab.Panel key={index}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <NextImage
                fill
                src={upgradeImageResolution(image)}
                alt="Image"
                className="object-cover object-center opacity-0 duration-300 transition-opacity"
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
                onLoad={(
                  event: React.SyntheticEvent<HTMLImageElement, Event>
                ) => event.currentTarget.classList.remove("opacity-0")}
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
