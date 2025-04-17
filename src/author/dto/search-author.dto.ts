import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchAuthorDto {
  @ApiProperty({
    example: 'Rowling',
    description: 'Author name to search in Open Library',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Search name must be at least 2 characters long' })
  name: string;
}
