import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { GetAllActiveProductsUseCase } from './use-cases/get-all-active-products.use-case';
import { GetProductBySkuUseCase } from './use-cases/get-product-by-sku.use-case';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsRepository,
    GetAllActiveProductsUseCase,
    GetProductBySkuUseCase,
  ],
  exports: [GetAllActiveProductsUseCase, GetProductBySkuUseCase],
})
export class ProductsModule {}
