import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { AdminOrdersService } from './admin-orders.service';
import { AdminWaybillService } from './admin-waybill.service';
import { AdminCancellationService } from './admin-cancellation.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { OrderStatus } from '@repo/shared-types';

@UseGuards(SupabaseAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly adminOrdersService: AdminOrdersService,
    private readonly adminWaybillService: AdminWaybillService,
    private readonly adminCancellationService: AdminCancellationService,
  ) {}

  @Get('metrics')
  async getMetrics(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.metricsService.getMetrics(isNaN(daysNum) ? 7 : daysNum);
  }

  @Get('orders')
  async getAllOrders() {
    return this.adminOrdersService.getAllOrders();
  }

  @Get('orders/:orderNumber')
  async getSingleOrder(@Param('orderNumber') orderNumber: string) {
    return this.adminOrdersService.getSingleOrder(orderNumber);
  }

  @Patch('orders/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updates: Record<string, unknown>,
  ) {
    return this.adminOrdersService.updateOrder(id, updates);
  }

  @Post('orders/:id/waybill')
  async generateWaybill(@Param('id') id: string) {
    return this.adminWaybillService.generateWaybill(id);
  }

  @Post('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.adminCancellationService.cancelOrder(id);
  }

  @Post('orders/:id/deliver')
  async markAsDelivered(@Param('id') id: string) {
    return this.adminOrdersService.markAsDelivered(id);
  }
}
