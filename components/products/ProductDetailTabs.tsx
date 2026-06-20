"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

interface ProductDetailTabsProps {
  dictionary: Dictionary["product"]["tabs"];
}

export function ProductDetailTabs({ dictionary }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(dictionary.items[0]?.id ?? "");
  const activeTabId = dictionary.items.some((item) => item.id === activeTab)
    ? activeTab
    : (dictionary.items[0]?.id ?? "");
  const activeContent =
    dictionary.items.find((item) => item.id === activeTabId)?.paragraphs ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="-mx-1 flex items-center justify-start gap-5 overflow-x-auto px-1 md:mx-0 md:gap-[32px] md:overflow-visible md:px-0">
        {dictionary.items.map((tab) => {
          const isActive = activeTabId === tab.id;

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
        {activeContent.map((paragraph) => (
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
