"use client";

import { useState } from "react";

interface ProductQuantityStepperProps {
  quantity?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  minQuantity?: number;
}

export function ProductQuantityStepper({
  quantity: quantityProp,
  onDecrease,
  onIncrease,
  minQuantity = 1,
}: ProductQuantityStepperProps) {
  const [internalQuantity, setInternalQuantity] = useState(minQuantity);
  const quantity = quantityProp ?? internalQuantity;

  const handleDecrease = () => {
    if (onDecrease) {
      onDecrease();
      return;
    }

    setInternalQuantity((current) => Math.max(minQuantity, current - 1));
  };

  const handleIncrease = () => {
    if (onIncrease) {
      onIncrease();
      return;
    }

    setInternalQuantity((current) => current + 1);
  };

  return (
    <div className="flex items-center justify-start">
      <button
        type="button"
        onClick={handleDecrease}
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
        onClick={handleIncrease}
        className="flex w-[30px] shrink-0 cursor-pointer items-center justify-center self-stretch rounded-r-[2px] border border-l-0 border-[#1C1C1A80] font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A] transition-colors duration-200 hover:bg-[#f3ede6]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
