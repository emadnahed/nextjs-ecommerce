import NextImage from "next/image";
import { Tab } from "@headlessui/react";

import { cn } from "@/lib/utils";

interface GalleryTabProps {
  image: string;
}

// Sanitize image URL to handle malformed concatenated URLs
const sanitizeImageUrl = (url: string): string => {
  if (!url) return '';

  // Handle malformed URLs (concatenated URLs like "https://...https://...")
  const httpsIndex = url.indexOf('https://', 1);
  const httpIndex = url.indexOf('http://', 1);

  if (httpsIndex > 0) {
    return url.substring(httpsIndex);
  }
  if (httpIndex > 0) {
    return url.substring(httpIndex);
  }

  // Already a proper URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Legacy format - needs base URL
  const baseUrl = "https://kemal-web-storage.s3.eu-north-1.amazonaws.com";
  return `${baseUrl}${url}`;
};

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white">
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <NextImage
              fill
              src={sanitizeImageUrl(image)}
              alt=""
              className="object-cover object-center"
              sizes="any"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-black" : "ring-transparent"
            )}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;
