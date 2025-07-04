import { NextResponse } from 'next/server';
import { listProducts, listVariants } from '@/lib/payments/lemonsqueezy';

export async function GET() {
  try {
    // Fetch all products
    const productsRes = await listProducts();
    const products = productsRes.data?.data || [];

    // For each product, fetch its variants
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variantsRes = await listVariants({ filter:{ productId: product.id } });
        const variants = variantsRes.data?.data || [];
        return {
          ...product,
          variants,
        };
      })
    );

    return NextResponse.json({ products: productsWithVariants });
  } catch (error) {
    console.error('Failed to fetch products and variants:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products and variants' },
      { status: 500 }
    );
  }
} 