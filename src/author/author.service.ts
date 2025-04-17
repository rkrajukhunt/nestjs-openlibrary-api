import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { Author } from './entities/author.entity';
import { OpenLibraryAuthor } from './interfaces/author.interface';
import { AuthorsRepository } from './authors.repository';
import { AppConfigService } from '../config/app-config.service';
import { retry } from '../common/utils/retry.util';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  async findAllAuthors(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
  }): Promise<{ data: Author[]; total: number; page: number; limit: number }> {
    return this.authorsRepository.findAll(query);
  }

  async findAuthorById(id: string): Promise<Author> {
    let author = await this.authorsRepository.findById(id);

    if (!author) {
      await this.searchAndSaveAuthors(id, true);
      this.logger.warn(
        `Author with ID ${id} not found in DB, attempted fetch.`,
      );

      author = await this.authorsRepository.findById(id);

      if (!author) {
        throw new NotFoundException(
          `Author with ID ${id} not found even after fetch`,
        );
      }
    }

    return author;
  }

  private mapOpenLibraryDocToAuthor(doc: OpenLibraryAuthor): Author {
    const {
      key: id,
      name,
      birth_date,
      work_count,
      ratings_average,
      ratings_sortable,
      ratings_count,
      ratings_count_1,
      ratings_count_2,
      ratings_count_3,
      ratings_count_4,
      ratings_count_5,
      want_to_read_count,
      already_read_count,
      currently_reading_count,
      readinglog_count,
      _version_,
    } = doc;

    return {
      id,
      name,
      birth_date,
      work_count,
      ratings_average,
      ratings_sortable,
      ratings_count,
      ratings_count_1,
      ratings_count_2,
      ratings_count_3,
      ratings_count_4,
      ratings_count_5,
      want_to_read_count,
      already_read_count,
      currently_reading_count,
      readinglog_count,
      version: _version_?.toString() || '',
      metadata: null,
    };
  }

  async searchAndSaveAuthors(
    query: string,
    isAuthorKeySearch = false,
  ): Promise<{
    total: number;
    saved: number;
    skipped: number;
    details: string[];
  }> {
    const {
      baseUrl,
      timeout: timeoutMs,
      retryAttempts,
      retryDelay,
    } = this.configService.openLibraryConfig;

    let url = `${baseUrl}/search/authors.json?q=${encodeURIComponent(query)}`;

    if (isAuthorKeySearch) {
      url = `${baseUrl}/search/authors.json?q=key:(/authors/${encodeURIComponent(
        query,
      )})`;
    }

    try {
      const { data } = await retry(
        async () => {
          const response = await firstValueFrom(
            this.httpService.get(url).pipe(
              timeout(timeoutMs),
              catchError((error: AxiosError) => {
                this.logger.error(
                  `HTTP request failed: ${error.message}`,
                  error.stack,
                );
                throw new InternalServerErrorException(
                  'Failed to retrieve author search data',
                );
              }),
            ),
          );
          return response;
        },
        retryAttempts,
        retryDelay,
      );

      const results: OpenLibraryAuthor[] = Array.isArray(data?.docs)
        ? data.docs
        : [];

      const details: string[] = [];
      let saved = 0;
      let skipped = 0;

      const authorTasks = results.map(async (doc) => {
        if (!doc?.key || !doc._version_) return;

        const id = doc.key;
        const version = doc._version_.toString();

        try {
          const existingAuthor = await this.authorsRepository.findById(id);

          if (existingAuthor && existingAuthor.version === version) {
            skipped++;
            details.push(`Skipped: ${id} - up-to-date`);
            return;
          }

          const author = this.mapOpenLibraryDocToAuthor(doc);

          if (existingAuthor) {
            await this.authorsRepository.update(id, author);
            details.push(`Updated: ${id}`);
          } else {
            await this.authorsRepository.create(author);
            details.push(`Created: ${id}`);
          }

          saved++;
        } catch (err) {
          this.logger.warn(`Error saving author ${id}: ${err.message}`);
          details.push(`Error on ${id}: ${err.message}`);
        }
      });

      await Promise.allSettled(authorTasks);

      return {
        total: results.length,
        saved,
        skipped,
        details,
      };
    } catch (error) {
      this.logger.error(`Author search failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Unexpected failure during author search',
      );
    }
  }
}
