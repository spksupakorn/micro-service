import { IsString, IsNumber, IsOptional, IsUUID, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 199.98, description: 'Total amount' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Shipping address',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shippingAddress?: string;

  @ApiProperty({
    example: 'Please deliver before 5 PM',
    description: 'Order notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
