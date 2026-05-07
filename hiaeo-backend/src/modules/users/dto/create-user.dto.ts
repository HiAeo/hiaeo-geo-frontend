import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '张三' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: '科技创新有限公司' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: '科技' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  website?: string;
}
