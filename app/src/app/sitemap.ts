import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://phantomgadgets.store";

  const staticPages = [
    { url: baseUrl, priority: 1, changeFrequency: "daily" as const },
    { url: `${baseUrl}/catalog`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${baseUrl}/about`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/faq`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/refund`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/shipping`, priority: 0.3, changeFrequency: "monthly" as const },
  ];

  const productPages = [
    { id: "p1", name: "Aurora Headphones", category: "Audio" },
    { id: "p2", name: "Nova Smartwatch", category: "Wearables" },
    { id: "p3", name: "Lumen Backpack", category: "Lifestyle" },
    { id: "p4", name: "Pulse Keyboard", category: "Accessories" },
    { id: "p5", name: "Phantom Earbuds", category: "Audio" },
    { id: "p6", name: "Titan Fitness Band", category: "Wearables" },
    { id: "p7", name: "Nebula Charger", category: "Accessories" },
    { id: "p8", name: "Echo Speaker", category: "Audio" },
    { id: "p9", name: "Prism Monitor", category: "Displays" },
    { id: "p10", name: "Flux SSD 1TB", category: "Storage" },
    { id: "p11", name: "Arc Mouse", category: "Accessories" },
    { id: "p12", name: "Vertex Router", category: "Networking" },
    { id: "p13", name: "Lens Action Camera", category: "Photography" },
    { id: "p14", name: "Cipher Pad", category: "Accessories" },
    { id: "p15", name: "Drone Mini 3", category: "Photography" },
    { id: "p16", name: "Core Fitness Tracker", category: "Wearables" },
    { id: "p17", name: "Vibe Soundbar", category: "Audio" },
    { id: "p18", name: "Spark Tablet", category: "Computing" },
    { id: "p19", name: "Stealth Keyboard", category: "Accessories" },
    { id: "p20", name: "Pixel Stand", category: "Accessories" },
    { id: "p21", name: "Nano Cam", category: "Photography" },
    { id: "p22", name: "Bolt Power Bank", category: "Accessories" },
    { id: "p23", name: "Glide Pen Tablet", category: "Accessories" },
    { id: "p24", name: "Hub Dock", category: "Accessories" },
    { id: "p25", name: "Wave Mic", category: "Audio" },
    { id: "p26", name: "Drone Air 2", category: "Photography" },
    { id: "p27", name: "Flex Tripod", category: "Photography" },
    { id: "p28", name: "Card Reader Pro", category: "Accessories" },
    { id: "p29", name: "Neon Desk Lamp", category: "Lifestyle" },
    { id: "p30", name: "Pulse Smart Scale", category: "Wearables" },
    { id: "p31", name: "Orbit USB Hub", category: "Accessories" },
    { id: "p32", name: "Voyager Backpack", category: "Lifestyle" },
    { id: "p33", name: "Crystal Earbuds", category: "Audio" },
    { id: "p34", name: "Zen Mouse Pad", category: "Accessories" },
  ];

  const productUrls = productPages.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    priority: 0.7,
    changeFrequency: "weekly" as const,
    lastmod: new Date().toISOString(),
  }));

  return [...staticPages, ...productUrls];
}
