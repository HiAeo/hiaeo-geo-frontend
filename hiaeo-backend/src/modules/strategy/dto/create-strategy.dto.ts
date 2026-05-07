import { IsString, IsOptional, IsArray, IsUrl, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CompetitorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUrl()
  url: string;
}

export class ContentPlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  topics?: Array<{ keyword: string; priority: number; estimatedWords: number }>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentTypes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publishingFrequency?: string;
}

export class CreateStrategyDto {
  @ApiProperty({ example: '科技行业 SEO 策略' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://www.example.com' })
  @IsUrl()
  targetUrl: string;

  @ApiPropertyOptional({ example: '科技' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: ['SEO优化', 'AI搜索', '内容营销'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetKeywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetitorDto)
  competitors?: CompetitorDto[];

  @ApiPropertyOptional({ example: ['deepseek', 'douban', 'baidu'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aiPlatforms?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentPlanDto)
  contentPlan?: ContentPlanDto;
}
