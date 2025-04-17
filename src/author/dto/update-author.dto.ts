import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthorDto {
  @ApiProperty({ description: 'Whether author was saved/updated' })
  saved: boolean;

  @ApiProperty({ description: 'Status message' })
  message: string;
}
