# Open Library Authors API

A production-ready NestJS application for fetching author data from the Open Library API and storing it in a PostgreSQL database, only updating records when the version changes.

## Features

- **TypeScript** - Type-safe code
- **NestJS** - Modern, modular backend framework
- **Knex** - SQL query builder with migration support
- **PostgreSQL** - Robust relational database
- **Swagger** - API documentation
- **Health checks** - Application and dependency health monitoring
- **Docker** - Containerization for consistent deployment

## Architecture

- **Repository Pattern** - Separation of data access logic
- **Service Layer** - Business logic encapsulation
- **DTO Pattern** - Type-safe data transfer objects
- **Configuration Management** - Environment-based config with validation
- **Error Handling** - Global exception filter with consistent responses
- **Logging** - Structured logging with request context
- **Swagger Documentation** - Auto-generated API docs

## Getting Started

### Prerequisites

- Node.js v20 or higher
- PostgreSQL 14 or higher (or use Docker)
- npm v9 or higher

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/rkrajukhunt/nestjs-openlibrary-api.git
   cd openlibrary-authors-api
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Run database migrations

   ```bash
   pnpm run migration:run
   ```

5. Start the application

   ```bash
   # Development
   pnpm run start:dev

   # Production
   pnpm run build
   pnpm run start:prod
   ```

## API Endpoints

- **GET /api/v1/health** - Check API health status
- **GET /api/docs** - API documentation (Swagger UI)

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
