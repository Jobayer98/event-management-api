# Use official Node.js LTS Alpine image for smaller size and security
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Development stage
FROM base AS deps

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Build stage
FROM base AS build

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Generate Prisma client with a dummy DATABASE_URL for build
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public"
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM base AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/prisma ./prisma

# Change ownership of the entire /app directory to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]