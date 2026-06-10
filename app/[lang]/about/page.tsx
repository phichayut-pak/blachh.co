import type { Metadata } from "next";

import { AboutPageContent } from "@/app/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About | Blachh",
  description:
    "Learn the story behind Blachh, our approach to matcha, and the slower rituals that shape the brand.",
};

export default function LocalizedAboutPage() {
  return <AboutPageContent />;
}
