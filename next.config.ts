import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // D-05: content must outlive its framework. Keep the output boring and portable.
  poweredByHeader: false,

  // Certificate verification URLs are permanent addresses (doc 06 §3).
  // Any future route change MUST add a redirect here rather than break a link.
  async redirects() {
    return [];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // Fonts are immutable once subsetted; cache them hard (doc 08 §4).
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
