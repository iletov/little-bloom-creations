import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { Product } from '@repo/shared-types';

@Injectable()
export class GetAllActiveProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(): Promise<Product[]> {
    return this.productsRepository.findAllActive();
  }
}
