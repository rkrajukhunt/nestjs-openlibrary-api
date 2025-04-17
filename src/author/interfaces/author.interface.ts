export interface OpenLibraryAuthor {
  key: string; // Author ID in format '/authors/OL123A'
  name: string;
  birth_date?: string;
  work_count?: number;
  ratings_average?: number;
  ratings_sortable?: number;
  ratings_count?: number;
  ratings_count_1?: number;
  ratings_count_2?: number;
  ratings_count_3?: number;
  ratings_count_4?: number;
  ratings_count_5?: number;
  want_to_read_count?: number;
  already_read_count?: number;
  currently_reading_count?: number;
  readinglog_count?: number;
  _version_?: string; // Stored as string to safely handle large values
  latest_revision?: string; // Stored as string to safely handle large values
  [key: string]: any; // For other potential fields
}
