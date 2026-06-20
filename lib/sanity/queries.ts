import { sanityClient } from "./client";

export interface SiteContent {
  site: unknown | null;
  banner: unknown | null;
  footer: unknown | null;
  home: unknown | null;
  about: unknown | null;
  contact: unknown | null;
  productCopy: unknown | null;
}

export interface ShopifyProductContent {
  handle: string;
  productTitle?: string;
  rating?: unknown | null;
  reviewSummary?: unknown | null;
  tabs?: unknown | null;
  reviewCarousel?: unknown | null;
}

const SITE_CONTENT_QUERY = /* groq */ `{
  "site": *[_id == "siteSettings"][0]{
    ...,
    "logoUrl": logo.asset->url
  },
  "banner": *[_id == "bannerSettings"][0],
  "footer": *[_id == "footerSettings"][0]{
    ...,
    "mascotImageUrl": mascotImage.asset->url
  },
  "home": *[_id == "homePage"][0]{
    ...,
    hero {
      ...,
      "imageUrl": image.asset->url
    },
    community {
      ...,
      "mascotImageUrl": mascotImage.asset->url,
      "cards": coalesce(cards[]{
        title,
        imageAlt,
        "videoUrl": video.asset->url,
        "imageUrl": image.asset->url
      }, [])
    },
    followBlachh {
      ...,
      "cards": coalesce(cards[]{
        title,
        imageAlt,
        "videoUrl": video.asset->url,
        "imageUrl": image.asset->url
      }, [])
    }
  },
  "about": *[_id == "aboutPage"][0]{
    ...,
    hero {
      ...,
      "imageUrl": image.asset->url
    },
    craft {
      ...,
      "imageUrl": image.asset->url
    }
  },
  "contact": *[_id == "contactPage"][0]{
    ...,
    hero {
      ...,
      "imageUrl": image.asset->url
    },
    emailCta {
      ...,
      "mascotImageUrl": mascotImage.asset->url
    }
  },
  "productCopy": *[_id == "productCopy"][0]
}`;

// Returns null when Sanity isn't configured, so callers fall back to the
// static dictionaries untouched.
export async function getSiteContent(): Promise<SiteContent | null> {
  if (!sanityClient) return null;

  return sanityClient.fetch<SiteContent>(
    SITE_CONTENT_QUERY,
    {},
    { next: { revalidate: 60, tags: ["sanity-content"] } },
  );
}

export async function getShopifyProductContentByHandle(
  handle: string,
): Promise<ShopifyProductContent | null> {
  if (!sanityClient) return null;

  return sanityClient.fetch<ShopifyProductContent | null>(
    /* groq */ `
      *[_type == "shopifyProductContent" && handle == $handle][0]
    `,
    { handle },
    { next: { revalidate: 60, tags: ["sanity-content"] } },
  );
}
