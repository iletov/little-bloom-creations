import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MetricsService } from './metrics.service';
import { AdminOrdersService } from './admin-orders.service';
import { AdminWaybillService } from './admin-waybill.service';
import { AdminCancellationService } from './admin-cancellation.service';
import { AdminRepository } from './admin.repository';
import { StripeModule } from '../stripe/stripe.module';
import { SanityModule } from '../sanity/sanity.module';

@Module({
  imports: [StripeModule, SanityModule],
  controllers: [AdminController],
  providers: [
    AdminRepository,
    MetricsService, 
    AdminOrdersService, 
    AdminWaybillService, 
    AdminCancellationService
  ],
})
export class AdminModule {}
