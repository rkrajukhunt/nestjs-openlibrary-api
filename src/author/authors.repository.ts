import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsRepository {
  private readonly logger = new Logger(AuthorsRepository.name);

  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
  }): Promise<{
    data: Author[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortDir = 'asc',
      search,
    } = options;

    try {
      const query = this.knex<Author>('authors');

      if (search) {
        query.whereILike('name', `%${search}%`);
      }

      const total = await query.clone().count('* as count').first();
      const data = await query
        .orderBy(sortBy, sortDir)
        .offset((page - 1) * limit)
        .limit(limit);

      return {
        data,
        total: Number(total['count'] ?? 0),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving authors: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Author | null> {
    try {
      return await this.knex<Author>('authors').where('id', id).first();
    } catch (error) {
      this.logger.error(
        `Error finding author by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async create(author: Author): Promise<Author> {
    try {
      await this.knex<Author>('authors').insert(author);
      return author;
    } catch (error) {
      this.logger.error(`Error creating author: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, data: Partial<Author>): Promise<void> {
    try {
      await this.knex<Author>('authors')
        .where('id', id)
        .update({
          ...data,
          updated_at: this.knex.fn.now(),
        });
    } catch (error) {
      this.logger.error(`Error updating author: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByIds(ids: string[]): Promise<Author[]> {
    try {
      return await this.knex<Author>('authors').whereIn('id', ids);
    } catch (error) {
      this.logger.error(
        `Error finding authors by IDs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByWorkCountRange(min: number, max: number): Promise<Author[]> {
    try {
      return await this.knex<Author>('authors')
        .whereBetween('work_count', [min, max])
        .orderBy('work_count', 'desc');
    } catch (error) {
      this.logger.error(
        `Error finding authors by work count range: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByTimePeriod(
    startYear: number,
    endYear: number,
  ): Promise<Author[]> {
    try {
      return await this.knex<Author>('authors')
        .where('birth_date', '>=', startYear)
        .andWhere((builder) => {
          builder.where('death_date', '<=', endYear).orWhereNull('death_date');
        })
        .orderBy('birth_date');
    } catch (error) {
      this.logger.error(
        `Error finding authors by time period: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
