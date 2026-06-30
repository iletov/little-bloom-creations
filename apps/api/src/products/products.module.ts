import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { GetAllActiveProductsUseCase } from './use-cases/get-all-active-products.use-case';
import { GetProductBySkuUseCase } from './use-cases/get-product-by-sku.use-case';
import { CheckProductQuantityUseCase } from './use-cases/check-product-quantity.use-case';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsRepository,
    GetAllActiveProductsUseCase,
    GetProductBySkuUseCase,
    CheckProductQuantityUseCase,
  ],
  exports: [
    GetAllActiveProductsUseCase,
    GetProductBySkuUseCase,
    CheckProductQuantityUseCase,
    ProductsRepository,
  ],
})
export class ProductsModule {}
