import { IsString, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CalculateShippingDto } from './calculate-shipping.dto';

export class SenderInfoDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  @IsOptional()
  email?: string;
}

export class ReceiptItemDto {
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  quantity!: number;
}

export class CreateWaybillDto extends CalculateShippingDto {
  @ValidateNested()
  @Type(() => SenderInfoDto)
  senderInfo!: SenderInfoDto;

  @IsString()
  @IsOptional()
  shipmentDescription?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  @IsOptional()
  receiptItems?: ReceiptItemDto[];
}
