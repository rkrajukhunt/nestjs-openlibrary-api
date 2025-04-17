import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthorsService } from './author.service';
import { AuthorResponseDto } from './dto/author-response.dto';
import { FetchAuthorDto } from './dto/fetch-author.dto';
import { SearchAuthorDto } from './dto/search-author.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all authors from the database with pagination and search',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDir', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of authors',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 132 },
        page: { type: 'number', example: 2 },
        limit: { type: 'number', example: 20 },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(AuthorResponseDto) },
        },
      },
    },
  })
  async getAllAuthors(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortDir') sortDir?: 'asc' | 'desc',
    @Query('search') search?: string,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: AuthorResponseDto[];
  }> {
    return this.authorsService.findAllAuthors({
      page,
      limit,
      sortBy,
      sortDir,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get author by ID' })
  @ApiParam({
    name: 'id',
    description: 'Author ID in Open Library format (OL123A)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Author found',
    type: AuthorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async getAuthor(@Param() params: FetchAuthorDto): Promise<AuthorResponseDto> {
    return this.authorsService.findAuthorById(params.id);
  }

  @Post('search/:name')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Search authors by name and save all unique results to database',
  })
  @ApiParam({
    name: 'name',
    description: 'Author name to search in Open Library',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Authors fetched and saved' })
  async searchAndSaveAuthors(@Param() params: SearchAuthorDto) {
    return this.authorsService.searchAndSaveAuthors(params.name);
  }
}
