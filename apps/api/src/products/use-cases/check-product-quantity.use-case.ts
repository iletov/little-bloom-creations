import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';

interface CartItem {
  sku: string;
  variantSku?: string;
  quantity: number;
}

@Injectable()
export class CheckProductQuantityUseCase {
  constructor(private readonly productsRepo: ProductsRepository) {}

  async execute(cartItems: CartItem[]): Promise<any> {
    const stockErrors: {
      sku: string;
      variantSku?: string;
      name: string;
      stock: number;
      requestedQuantity: number;
    }[] = [];

    for (const item of cartItems) {
      const product = await this.productsRepo.findBySku(item.sku);
      
      if (!product) {
        throw new BadRequestException(`Product with SKU ${item.sku} not found`);
      }

      // Check variant stock if variantSku is provided
      if (item.variantSku) {
        const variant = product.variants.find(v => v.variantSku === item.variantSku);
        if (!variant) {
           throw new BadRequestException(`Variant ${item.variantSku} for product ${item.sku} not found`);
        }
        
        if (variant.currentStock < item.quantity) {
          stockErrors.push({
            sku: item.sku,
            variantSku: item.variantSku,
            name: `${product.name} - ${variant.variantName}`,
            stock: variant.currentStock,
            requestedQuantity: item.quantity,
          });
        }
      } else {
        // Check main product stock
        if (product.currentStock < item.quantity) {
          stockErrors.push({
            sku: item.sku,
            name: product.name,
            stock: product.currentStock,
            requestedQuantity: item.quantity,
          });
        }
      }
    }

    return stockErrors.length > 0 ? stockErrors : null;
  }
}
