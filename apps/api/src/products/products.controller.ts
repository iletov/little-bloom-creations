import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GetAllActiveProductsUseCase } from './use-cases/get-all-active-products.use-case';
import { GetProductBySkuUseCase } from './use-cases/get-product-by-sku.use-case';
import { CheckProductQuantityUseCase } from './use-cases/check-product-quantity.use-case';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getAllActiveProductsUseCase: GetAllActiveProductsUseCase,
    private readonly getProductBySkuUseCase: GetProductBySkuUseCase,
    private readonly checkProductQuantityUseCase: CheckProductQuantityUseCase,
  ) {}

  @Get()
  async getAllActive() {
    return this.getAllActiveProductsUseCase.execute();
  }

  @Post('check-quantity')
  async checkQuantity(@Body() data: { cartItems: { sku: string; quantity: number; variantSku?: string }[] }) {
    return this.checkProductQuantityUseCase.execute(data.cartItems);
  }

  @Get(':sku')
  async getBySku(@Param('sku') sku: string) {
    return this.getProductBySkuUseCase.execute(sku);
  }
}
