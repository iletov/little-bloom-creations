import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CancelStripeOrderDto {
  @IsString()
  @IsNotEmpty()
  paymentIntentId!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
