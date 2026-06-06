"use client";

import { useState } from "react";

export function ProductQuantityStepper() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center justify-start">
      <button
        type="button"
        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        className="flex w-[30px] shrink-0 cursor-pointer items-center justify-center self-stretch rounded-l-[2px] border border-r-0 border-[#1C1C1A80] font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A] transition-colors duration-200 hover:bg-[#f3ede6]"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <div className="flex w-[30px] shrink-0 items-center justify-center self-stretch border-y border-x border-[#1C1C1A80] font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A]">
        {quantity}
      </div>
      <button
        type="button"
        onClick={() => setQuantity((current) => current + 1)}
        className="flex w-[30px] shrink-0 cursor-pointer items-center justify-center self-stretch rounded-r-[2px] border border-l-0 border-[#1C1C1A80] font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A] transition-colors duration-200 hover:bg-[#f3ede6]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
