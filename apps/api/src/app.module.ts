import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ShippingModule } from './shipping/shipping.module';
import { OrdersModule } from './orders/orders.module';
import { SanityModule } from './sanity/sanity.module';

@Module({
  imports: [ProductsModule, ShippingModule, OrdersModule, SanityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
