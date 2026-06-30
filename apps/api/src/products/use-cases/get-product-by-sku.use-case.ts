import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { Product } from '@repo/shared-types';

@Injectable()
export class GetProductBySkuUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(sku: string): Promise<Product> {
    const product = await this.productsRepository.findBySku(sku);
    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }
    return product;
  }
}
