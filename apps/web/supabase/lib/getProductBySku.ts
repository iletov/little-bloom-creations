const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function getProductBySku(sku: string) {
  try {
    const res = await fetch(`${API_URL}/products/${sku}`, {
      next: { tags: [`product-${sku}`], revalidate: 360 },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch product ${sku}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${sku} from NestJS:`, error);
    return null;
  }
}
