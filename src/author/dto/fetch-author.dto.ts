import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FetchAuthorDto {
  @ApiProperty({
    description: 'The Open Library author ID',
    example: 'OL23919A',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^OL\d+[A-Z]$/, {
    message:
      'Author ID must be in the format of OL{number}{letter}, e.g. OL23919A',
  })
  id: string;
}
