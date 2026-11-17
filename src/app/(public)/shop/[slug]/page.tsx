import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_LAPTOPS, getLaptopBySlug, LaptopData } from "@/data/laptops";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const laptop = getLaptopBySlug(resolvedParams.slug);
  if (!laptop) return { title: "Laptop Not Found | NextGen IT Hub" };

  const priceINR = (laptop.sellingPrice / 100).toLocaleString("en-IN");
  const title = `${laptop.model} (Grade ${laptop.grade.replace("_", "+")}) | NextGen IT Hub`;
  const description = `Buy certified refurbished ${laptop.model} at ₹${priceINR}. 40-Point QC Passed, 6–12 months pan-India doorstep warranty, 18% GST input tax credit. Fast dispatch from Shakarpur, Delhi.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: laptop.imageUrl, width: 1200, height: 630, alt: laptop.model }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [laptop.imageUrl],
    },
  };
}

export function generateStaticParams() {
  return ALL_LAPTOPS.map((laptop) => ({
    slug: laptop.slug,
  }));
}

export default async function LaptopDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const laptop = getLaptopBySlug(resolvedParams.slug);

  if (!laptop) {
    notFound();
  }

  // Related laptops: same brand first, then others
  const relatedLaptops = ALL_LAPTOPS.filter(
    (item) => item.id !== laptop.id && (item.brand === laptop.brand || item.category === laptop.category)
  ).slice(0, 4);

  // If fewer than 4, add other laptops from catalog
  if (relatedLaptops.length < 4) {
    const additional = ALL_LAPTOPS.filter(
      (item) => item.id !== laptop.id && !relatedLaptops.some((r) => r.id === item.id)
    ).slice(0, 4 - relatedLaptops.length);
    relatedLaptops.push(...additional);
  }

  // Schema.org structured data for SEO
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nextgenithub.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: laptop.model,
    description: laptop.description,
    image: [laptop.imageUrl, laptop.secondaryImageUrl],
    brand: {
      "@type": "Brand",
      name: laptop.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${appUrl}/shop/${laptop.slug}`,
      priceCurrency: "INR",
      price: laptop.sellingPrice / 100,
      itemCondition: "https://schema.org/RefurbishedCondition",
      availability: laptop.availableUnits > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "NextGen IT Hub",
        address: "Mother Dairy Road, Shakarpur, East Delhi, Delhi 110092",
        telephone: "+91-9155282776",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient laptop={laptop} relatedLaptops={relatedLaptops} />
    </>
  );
}
