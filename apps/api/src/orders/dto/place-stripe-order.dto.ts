import { IsOptional, IsString } from 'class-validator';
import { PlaceCashOrderDto } from './place-cash-order.dto';

export class PlaceStripeOrderDto extends PlaceCashOrderDto {
  @IsString()
  @IsOptional()
  existingOrderNumber?: string;

  @IsString()
  @IsOptional()
  existingPaymentIntentId?: string;
}
