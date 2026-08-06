import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bento",
    short_name: "Bento",
    description:
      "A command center for the agents building your product.",
    start_url: "/",
    display: "standalone",
    background_color: "#12161E",
    theme_color: "#12161E",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
