import type { NextConfig } from "next";

const demo = process.env.DEMO === "1";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],
  ...(demo
    ? { output: "export", trailingSlash: true, distDir: "out-build", images: { unoptimized: true } }
    : {
        async redirects() {
          return [{ source: "/", destination: "/es", permanent: false }];
        },
        async headers() {
          return [{ source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
        },
      }),
};

export default config;
