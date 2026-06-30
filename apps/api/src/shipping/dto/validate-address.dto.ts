import { IsEnum, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryMethodEnum } from '@repo/shared-types';
import { AddressDto } from './calculate-shipping.dto';

export class ValidateAddressDto {
  @IsEnum(DeliveryMethodEnum)
  deliveryMethod!: DeliveryMethodEnum;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsString()
  @IsOptional()
  postalCode?: string;
}
