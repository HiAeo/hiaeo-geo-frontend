import { IsUrl, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiagnoseDto {
  @ApiProperty({ example: 'https://www.example.com' })
  @IsUrl()
  targetUrl: string;

  @ApiPropertyOptional({ example: '示例网站' })
  @IsOptional()
  @IsString()
  targetName?: string;

  @ApiPropertyOptional({ example: '科技' })
  @IsOptional()
  @IsString()
  targetIndustry?: string;
}
