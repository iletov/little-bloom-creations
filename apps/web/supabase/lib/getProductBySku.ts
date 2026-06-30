import { apiConfig } from '@/lib/api/api-config';

const API_URL = apiConfig.baseUrl;

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
