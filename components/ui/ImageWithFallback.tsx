"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const resolvedSrc = src || fallbackSrc;
  const [failedSources, setFailedSources] = useState<Record<string, true>>({});
  const activeSrc = failedSources[resolvedSrc] ? fallbackSrc : resolvedSrc;

  return (
    <Image
      {...props}
      src={activeSrc}
      alt={alt}
      onError={() => {
        if (resolvedSrc !== fallbackSrc) {
          setFailedSources((current) => ({ ...current, [resolvedSrc]: true }));
        }
      }}
    />
  );
}
