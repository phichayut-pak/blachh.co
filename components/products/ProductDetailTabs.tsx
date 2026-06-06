"use client";

import { useState } from "react";

type TabId = "description" | "brewing-notes" | "storage";

const tabItems: Array<{ id: TabId; label: string }> = [
  { id: "description", label: "Description" },
  { id: "brewing-notes", label: "Brewing notes" },
  { id: "storage", label: "Storage" },
];

const tabContent: Record<TabId, string[]> = {
  description: [
    "Grown in the misty mountains of Kagoshima, this first harvest matcha is crafted from Okumidori and Saemidori cultivars. With its deep umami, smooth texture, and hints of hinoki forest, it brings clarity and calm to your day.",
    "Its profile stays smooth and balanced in a straight whisked bowl, with enough depth to feel layered without turning bitter.",
    "This is the kind of matcha that works well as an everyday ritual pick when you want clarity, sweetness, and a clean texture.",
  ],
  "brewing-notes": [
    "Sift 1 to 2 teaspoons into a warm bowl to remove clumps and keep the final texture even.",
    "Add a small amount of water around 75 to 80 degrees Celsius, then whisk in quick zig-zag motions until a fine foam forms.",
    "For a lighter cup, use more water. For a richer cup, keep the water lower and whisk for a denser body.",
  ],
  storage: [
    "Keep the tin sealed tightly and store it somewhere cool, dry, and away from direct sunlight.",
    "Once opened, avoid heat and moisture exposure so the color and aroma stay fresh for longer.",
    "For best flavor, finish the tin within a few weeks of opening and let it return to room temperature before use if chilled.",
  ],
};

export function ProductDetailTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <div className="flex flex-col gap-5">
      <div className="-mx-1 flex items-center justify-start gap-5 overflow-x-auto px-1 md:mx-0 md:gap-[32px] md:overflow-visible md:px-0">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 cursor-pointer py-1 font-libre text-sm transition-colors duration-200 ${
                isActive
                  ? "text-[#1C1C1A]"
                  : "text-[#838079] hover:text-[#1C1C1A]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {tabContent[activeTab].map((paragraph) => (
          <p
            key={paragraph}
            className="font-libre text-[12px] font-normal leading-[23.427px] text-[#7E7A72]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
