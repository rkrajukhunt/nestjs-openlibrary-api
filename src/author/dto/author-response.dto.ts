import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthorResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the author',
    example: 'OL123A',
  })
  id: string;

  @ApiProperty({
    description: 'The full name of the author',
    example: 'J.K. Rowling',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1965-07-31',
    nullable: true,
  })
  birth_date?: string | null;

  @ApiPropertyOptional({
    description: 'Number of works by this author',
    example: 42,
    nullable: true,
  })
  work_count?: number | null;

  @ApiPropertyOptional({
    description: 'Average rating',
    example: 4.2,
    nullable: true,
  })
  ratings_average?: number | null;

  @ApiPropertyOptional({
    description: 'Sortable rating score',
    example: 4.15,
    nullable: true,
  })
  ratings_sortable?: number | null;

  @ApiPropertyOptional({ description: 'Total ratings', example: 230 })
  ratings_count?: number | null;

  @ApiPropertyOptional({ description: '1-star ratings', example: 5 })
  ratings_count_1?: number | null;

  @ApiPropertyOptional({ description: '2-star ratings', example: 12 })
  ratings_count_2?: number | null;

  @ApiPropertyOptional({ description: '3-star ratings', example: 48 })
  ratings_count_3?: number | null;

  @ApiPropertyOptional({ description: '4-star ratings', example: 90 })
  ratings_count_4?: number | null;

  @ApiPropertyOptional({ description: '5-star ratings', example: 75 })
  ratings_count_5?: number | null;

  @ApiPropertyOptional({ description: 'Users who want to read', example: 1000 })
  want_to_read_count?: number | null;

  @ApiPropertyOptional({ description: 'Users who already read', example: 500 })
  already_read_count?: number | null;

  @ApiPropertyOptional({ description: 'Users currently reading', example: 25 })
  currently_reading_count?: number | null;

  @ApiPropertyOptional({ description: 'Reading log count', example: 1520 })
  readinglog_count?: number | null;

  @ApiProperty({
    description: 'Version of the author data from Open Library',
    example: '1828015701947842560',
  })
  version: string;

  @ApiPropertyOptional({
    description: 'When this record was created',
    example: '2025-04-16T12:00:00Z',
  })
  created_at?: Date;

  @ApiPropertyOptional({
    description: 'When this record was last updated',
    example: '2025-04-16T12:00:00Z',
  })
  updated_at?: Date;
}
