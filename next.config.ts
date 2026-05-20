// next.config.ts

/* images.remotePatterns
next/image optimises, resizes and serves images through Next.js's own CDN pipeline.
*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Yahoo Finance / Yahoo CDN (news article thumbnails)
      {
        protocol: "https",
        hostname: "s.yimg.com",
        pathname: "/**",
      },
      // Zenfs — syndicated Yahoo Finance article images
      {
        protocol: "https",
        hostname: "media.zenfs.com",
        pathname: "/**",
      },
      // Unsplash — used for fallback/mock articles in development
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
