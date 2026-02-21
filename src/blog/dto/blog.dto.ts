import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}





export class UpdateBlogDto extends PartialType(CreateBlogDto) {}