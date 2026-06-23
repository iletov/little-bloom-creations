import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  Min,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryMethodEnum } from '@repo/shared-types';

export class OrderItemDto {
  @IsUUID()
  productId!: string;

  @IsUUID()
  @IsOptional()
  variantId?: string;

  @IsString()
  sku!: string;

  @IsString()
  @IsOptional()
  variantSku?: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  variantName?: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsNumber()
  @Min(0)
  weight!: number;

  @IsOptional()
  personalization?: Record<string, unknown>;
}

export class OrderAddressDto {
  @IsString() city!: string;
  @IsString() @IsOptional() postalCode?: string;
  @IsString() @IsOptional() street?: string;
  @IsString() @IsOptional() streetNumber?: string;
  @IsString() @IsOptional() quarter?: string;
  @IsNumber() @IsOptional() siteId?: number;
  @IsNumber() @IsOptional() streetId?: number;
  @IsString() @IsOptional() country?: string;
}

export class OrderRecipientDto {
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsString() phone!: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() officeId?: string;
  @IsString() @IsOptional() officeName?: string;
}

export class PlaceCashOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ValidateNested()
  @Type(() => OrderAddressDto)
  recipientAddress!: OrderAddressDto;

  @ValidateNested()
  @Type(() => OrderRecipientDto)
  recipientInfo!: OrderRecipientDto;

  @IsEnum(DeliveryMethodEnum)
  deliveryMethod!: DeliveryMethodEnum;

  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @IsNumber()
  @Min(0)
  deliveryCost!: number;

  @IsNumber()
  @Min(0)
  totalWeight!: number;

  @IsString()
  @IsOptional()
  shipmentDescription?: string;
}
