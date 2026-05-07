import { IsString, IsOptional, IsArray, IsUrl, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '../entities/content.entity';

export class CreateContentDto {
  @ApiProperty({ example: '如何优化网站SEO' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ example: ['SEO优化', '网站排名'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class GenerateContentDto {
  @ApiProperty({ example: 'SEO优化技巧' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({ example: ['SEO优化', '网站排名', '搜索引擎'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ example: '企业用户' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ example: 'professional' })
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiPropertyOptional({ example: 'medium' })
  @IsOptional()
  @IsEnum(['short', 'medium', 'long'])
  length?: 'short' | 'medium' | 'long';
}

export class UpdateContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
