"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { localizeHref } from "@/lib/i18n";

type LocalizedLinkProps = ComponentProps<typeof Link>;

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const pathname = usePathname();

  if (typeof href !== "string") {
    return <Link href={href} {...props} />;
  }

  return <Link href={localizeHref(href, pathname ?? "/")} {...props} />;
}
