import StoreShell from "@/components/store-shell";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  let product;
  try {
    await connectToDatabase();
    product = await Product.findById(id).lean().exec();
  } catch {
    // ignore
  }

  if (!product) {
    return { title: "Product Not Found | Phantom Gadgets" };
  }

  return {
    title: `${product.name} | Phantom Gadgets`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <StoreShell view="product" productId={id} />;
}
