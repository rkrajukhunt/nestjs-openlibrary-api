# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the compiled app from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/src/db/knexfile.js ./
COPY --from=builder /app/src/db/migrations ./src/db/migrations

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]