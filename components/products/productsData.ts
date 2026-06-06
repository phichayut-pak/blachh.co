export type ProductCategory = "Matcha" | "Books" | "Toys";

export interface Product {
  imageSrc: string;
  productName: string;
  size: number;
  price: number;
  currency: string;
  category: ProductCategory;
  eyebrow: string;
  description: string;
  tastingNotes: string[];
}

export const products: Product[] = [
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Hinoki",
    size: 30,
    price: 349,
    currency: "SEK",
    category: "Matcha",
    eyebrow: "Stone-milled ceremonial matcha",
    description:
      "A soft, rounded matcha with a calm woody finish and enough body for everyday whisking.",
    tastingNotes: ["Cedar", "Cream", "Fresh grass"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Matcha",
    size: 50,
    price: 429,
    currency: "SEK",
    category: "Matcha",
    eyebrow: "Balanced house blend",
    description:
      "Clean umami, gentle sweetness, and a bright green cup made for daily rituals.",
    tastingNotes: ["Umami", "Sweet pea", "Silky finish"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Organic",
    size: 80,
    price: 599,
    currency: "SEK",
    category: "Matcha",
    eyebrow: "Large-format organic tin",
    description:
      "An easy-drinking organic matcha with a smooth profile and a fuller finish.",
    tastingNotes: ["Spinach", "Vanilla", "Light toast"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Ceremonial",
    size: 30,
    price: 389,
    currency: "SEK",
    category: "Matcha",
    eyebrow: "Small-batch ceremonial grade",
    description:
      "Bright and lively with a light floral edge designed for straight preparation.",
    tastingNotes: ["Wildflower", "Melon", "Soft bitterness"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Classic",
    size: 40,
    price: 319,
    currency: "SEK",
    category: "Books",
    eyebrow: "Foundational starter pick",
    description:
      "A dependable everyday option with a mellow body and a clean finish.",
    tastingNotes: ["Oat", "Hay", "Buttercream"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Reserve",
    size: 60,
    price: 679,
    currency: "SEK",
    category: "Books",
    eyebrow: "Richer premium selection",
    description:
      "Deeper umami and a longer finish with a more concentrated texture in the bowl.",
    tastingNotes: ["Cocoa nib", "Seaweed", "Sweet cream"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Zen",
    size: 30,
    price: 299,
    currency: "SEK",
    category: "Books",
    eyebrow: "Light and approachable",
    description:
      "A gentle profile with low bitterness and a smooth mouthfeel for casual use.",
    tastingNotes: ["Pear", "Young spinach", "Milk"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Forest",
    size: 70,
    price: 549,
    currency: "SEK",
    category: "Toys",
    eyebrow: "Deep green full-bodied blend",
    description:
      "Heavier texture with a grounded finish and a more savory overall profile.",
    tastingNotes: ["Moss", "Broth", "Roasted nuts"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Yuzu",
    size: 25,
    price: 269,
    currency: "SEK",
    category: "Toys",
    eyebrow: "Bright and lifted profile",
    description:
      "Fresh citrus-like aromatics paired with a lighter body and quick finish.",
    tastingNotes: ["Citrus zest", "Mint", "Tender greens"],
  },
  {
    imageSrc: "/mock/mock-product.png",
    productName: "Stone",
    size: 50,
    price: 459,
    currency: "SEK",
    category: "Toys",
    eyebrow: "Dense and mineral-led",
    description:
      "A savory cup with steady intensity and a long, structured aftertaste.",
    tastingNotes: ["Mineral", "Chestnut", "Umami"],
  },
];
