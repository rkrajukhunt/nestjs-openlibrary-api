export class Author {
  id: string; // We'll extract the ID portion (e.g., 'OL123A')
  name: string;
  birth_date?: string | null;
  work_count?: number | null;
  ratings_average?: number | null;
  ratings_sortable?: number | null;
  ratings_count?: number | null;
  ratings_count_1?: number | null;
  ratings_count_2?: number | null;
  ratings_count_3?: number | null;
  ratings_count_4?: number | null;
  ratings_count_5?: number | null;
  want_to_read_count?: number | null;
  already_read_count?: number | null;
  currently_reading_count?: number | null;
  readinglog_count?: number | null;

  version: string;
  metadata?: Record<string, any>;

  created_at?: Date;
  updated_at?: Date;
}
