import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryMethodEnum, PaymentMethodEnum } from '@repo/shared-types';

export class AddressDto {
  @IsString()
  city!: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  streetNumber?: string;

  @IsString()
  @IsOptional()
  quarter?: string;

  @IsString()
  @IsOptional()
  other?: string;

  @IsNumber()
  @IsOptional()
  siteId?: number;

  @IsNumber()
  @IsOptional()
  streetId?: number;

  @IsString()
  @IsOptional()
  blockNo?: string;

  @IsString()
  @IsOptional()
  entranceNo?: string;

  @IsString()
  @IsOptional()
  floorNo?: string;

  @IsString()
  @IsOptional()
  apartmentNo?: string;
}

export class ParcelDimensionsDto {
  @IsNumber()
  seqNo!: number;

  @IsNumber()
  weight!: number;

  @IsNumber()
  width!: number;

  @IsNumber()
  height!: number;

  @IsNumber()
  depth!: number;

  @IsString()
  @IsOptional()
  ref1?: string;
}

export class RecipientInfoDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  // officeId can be string or number in Zod, but let's accept it as string/any in DTO if needed,
  // or simply force it to string and let transform handle it. We will use flexible validation.
  @IsOptional()
  officeId?: string | number;

  @IsString()
  @IsOptional()
  clientName?: string;
}

export class CalculateShippingDto {
  @IsEnum(DeliveryMethodEnum)
  deliveryMethod!: DeliveryMethodEnum;

  @IsEnum(PaymentMethodEnum)
  @IsOptional()
  paymentMethod: PaymentMethodEnum | null = null;

  @IsNumber()
  totalWeight!: number;

  @IsNumber()
  totalAmount!: number;

  @ValidateNested()
  @Type(() => AddressDto)
  recipientAddress!: AddressDto;

  @ValidateNested()
  @Type(() => RecipientInfoDto)
  recipientInfo!: RecipientInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParcelDimensionsDto)
  parcels!: ParcelDimensionsDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  senderAddress?: AddressDto;
}
