export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'postgres',
  },
  openLibrary: {
    baseUrl: process.env.OPEN_LIBRARY_BASE_URL || 'https://openlibrary.org',
    timeout: parseInt(process.env.OPEN_LIBRARY_TIMEOUT, 10) || 5000,
    retryAttempts: parseInt(process.env.OPEN_LIBRARY_RETRY_ATTEMPTS, 10) || 3,
    retryDelay: parseInt(process.env.OPEN_LIBRARY_RETRY_DELAY, 10) || 1000,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 60 * 60 * 1000, // 1 hour in milliseconds
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // limit each IP to 100 requests per windowMs
  },
});
