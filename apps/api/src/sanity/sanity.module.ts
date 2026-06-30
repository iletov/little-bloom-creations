import { Module } from '@nestjs/common';
import { SanityWebhooksController } from './sanity-webhooks.controller';
import { SanityController } from './sanity.controller';
import { SyncSanityProductUseCase } from './use-cases/sync-sanity-product.use-case';
import { GetSanitySenderInfoUseCase } from './use-cases/get-sanity-sender-info.use-case';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [SanityWebhooksController, SanityController],
  providers: [SyncSanityProductUseCase, GetSanitySenderInfoUseCase],
  exports: [GetSanitySenderInfoUseCase],
})
export class SanityModule {}
