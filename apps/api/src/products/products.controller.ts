import { Controller, Get, Param } from '@nestjs/common';
import { GetAllActiveProductsUseCase } from './use-cases/get-all-active-products.use-case';
import { GetProductBySkuUseCase } from './use-cases/get-product-by-sku.use-case';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getAllActiveProductsUseCase: GetAllActiveProductsUseCase,
    private readonly getProductBySkuUseCase: GetProductBySkuUseCase,
  ) {}

  @Get()
  async getAllActive() {
    return this.getAllActiveProductsUseCase.execute();
  }

  @Get(':sku')
  async getBySku(@Param('sku') sku: string) {
    return this.getProductBySkuUseCase.execute(sku);
  }
}
