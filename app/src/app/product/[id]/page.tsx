import StoreShell from "@/components/store-shell";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <StoreShell view="product" productId={id} />;
}
