# Venue Booking System

A comprehensive Venue Booking System built with Node.js, TypeScript, Express, Prisma, and PostgreSQL. This system provides complete authentication, user management, and event booking capabilities for both customers and organizers.

## Features

### Authentication System
- **User Authentication**: Registration, login, and password reset for customers
- **Organizer Authentication**: Separate authentication system for event organizers/admins
- **Role-Based Access Control**: JWT tokens with role-based permissions
- **Automatic Admin Creation**: Default admin account created on first startup
- **Password Security**: bcrypt hashing with 12 rounds for secure password storage

### Database & Architecture
- **Clean Architecture**: Repository → Service → Controller → Routes pattern
- **Database**: PostgreSQL with Prisma ORM
- **UUID Primary Keys**: Scalable and secure identifier system
- **Comprehensive Indexing**: Optimized database queries with proper indexes
- **Migration System**: Version-controlled database schema changes

### API Features
- **RESTful API**: Well-structured REST endpoints with proper HTTP methods
- **Input Validation**: Zod schemas for comprehensive request validation
- **Error Handling**: Centralized error handling with detailed logging
- **Request Logging**: Winston-based logging with request/response tracking
- **Health Checks**: Database connectivity and system health monitoring

### Event Management
- **Event Status Management**: Admins/organizers can update event status (pending, confirmed, cancelled)
- **Event Listing**: Comprehensive event listing with pagination and filtering
- **Event Details**: Detailed event information including venue and meal details
- **Role-Based Access**: Admin/organizer-only endpoints for event management

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet.js, express-rate-limit
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Logging**: Winston with winston-daily-rotate-file
- **Development**: nodemon, ts-node, concurrently

## Database Schema

### Core Entities
- **Users**: Customer accounts with authentication
- **Organizers**: Event organizer/admin accounts
- **Venues**: Event locations with capacity and pricing
- **Meals**: Food options with pricing and categories
- **Events**: Main booking entity with time slots and status
- **Payments**: Transaction records with multiple payment methods
- **Notifications**: User messaging system

## API Endpoints

### User Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/reset` - Request password reset
- `PUT /api/v1/auth/reset` - Confirm password reset

### Organizer Authentication
- `POST /api/v1/admin/login` - Organizer login
- `GET /api/v1/admin/profile` - Get organizer profile
- `PUT /api/v1/admin/profile` - Update organizer profile
- `PUT /api/v1/admin/password` - Update organizer password

### Organizer Event Management
- `GET /api/v1/admin/events` - Get all events (Admin/Organizer only)
- `GET /api/v1/admin/events/:eventId` - Get event by ID (Admin/Organizer only)
- `PATCH /api/v1/admin/events/:eventId/status` - Update event status (Admin/Organizer only)

### System Health
- `GET /api/health` - System health check
- `GET /` - API information

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN=7d

# Password Reset Configuration
RESET_TOKEN_SECRET="your-reset-token-secret-change-in-production"
RESET_TOKEN_EXPIRES_IN=1h

# Default Admin Configuration
ADMIN_EMAIL="admin@eventmanagement.com"
ADMIN_PASSWORD="Admin123!@#"
ADMIN_NAME="System Administrator"

# Docker Database Container
DB_CONTAINER_NAME=my-db
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Using Docker (recommended)
   docker run --name my-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
   
   # Or install PostgreSQL locally
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8080` and automatically create the default admin account.

6. **Access API Documentation**
   
   Interactive Swagger documentation is available at:
   ```
   http://localhost:8080/api-docs
   ```

## API Usage Examples

### Organizer Event Management

#### 1. Login as Admin/Organizer
```bash
curl -X POST http://localhost:8080/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eventmanagement.com",
    "password": "Admin123!@#"
  }'
```

#### 2. Get All Events (with pagination and filters)
```bash
curl -X GET "http://localhost:8080/api/v1/admin/events?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Get Specific Event
```bash
curl -X GET http://localhost:8080/api/v1/admin/events/EVENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Update Event Status
```bash
curl -X PATCH http://localhost:8080/api/v1/admin/events/EVENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Event Status Values
- `pending` - Event is awaiting approval
- `confirmed` - Event has been approved and confirmed
- `cancelled` - Event has been cancelled

## Development Scripts

- `npm run dev` - Start development server with auto-restart
- `npm run dev:run` - Run server once (for testing)
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma database browser
- `npx prisma migrate reset` - Reset database with fresh schema

## Project Structure

```
src/
├── api/
│   └── v1/
│       ├── controllers/     # HTTP request handlers
│       ├── repositories/    # Database operations
│       ├── routes/         # API route definitions
│       └── services/       # Business logic
├── config/                 # Configuration files
├── middleware/             # Express middleware
├── schemas/               # Zod validation schemas
├── services/              # Application services
└── utils/                 # Utility functions

prisma/
├── migrations/            # Database migrations
└── schema.prisma         # Database schema definition
```

## Default Admin Account

When the application starts for the first time, it automatically creates a default admin account:

- **Email**: `admin@eventmanagement.com`
- **Password**: `Admin123!@#`
- **Role**: Organizer/Admin

You can customize these credentials using environment variables.

### Authentication & Authorization
- **Password Hashing**: bcrypt with 12 rounds for secure password storage
- **JWT Tokens**: Secure token-based authentication with role-based access control
- **Automatic Token Expiration**: Configurable token lifetime (default: 7 days)
- **Password Reset**: Secure token-based password reset with expiration

### Security Headers (Helmet.js)
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Additional XSS protection layer

### Rate Limiting
Protection against brute force attacks and API abuse:

| Endpoint Type | Limit | Window | Description |
|--------------|-------|--------|-------------|
| General API | 100 requests | 15 minutes | All API endpoints |
| Authentication | 5 attempts | 15 minutes | Login/Register endpoints |
| Password Reset | 3 attempts | 1 hour | Password reset requests |
| File Upload | 20 uploads | 15 minutes | Image upload endpoints |

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time when limit resets

### Additional Security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Zod schemas validate all incoming requests
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Request Size Limits**: 10MB limit on JSON payloads
- **Proxy Trust**: Configured for deployment behind reverse proxies
- **Environment Variables**: All sensitive data stored securely

The application uses Winston for comprehensive logging with advanced monitoring capabilities:

### Log Files (with Daily Rotation)
- **Combined Logs**: All application logs (14 days retention)
- **Error Logs**: Error-level logs only (30 days retention)
- **HTTP Logs**: Request/response logs (7 days retention)
- **Exception Logs**: Uncaught exceptions (30 days retention)
- **Rejection Logs**: Unhandled promise rejections (30 days retention)

### Features
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Automatic Rotation**: Daily log rotation with size limits (20MB per file)
- **Performance Tracking**: Slow request detection (>1000ms)
- **System Metrics**: Logged every 15 minutes (uptime, memory, CPU)
- **Request Statistics**: Logged every 30 minutes (total requests, errors)
- **Health Monitoring**: `/api/health` endpoint with comprehensive metrics

### Helper Functions
```typescript
import { logError, logRequest, logAuth, logDatabase, logPerformance } from './config/logger';

// Error logging with context
logError('Operation failed', error, { userId, operation });

// Request logging
logRequest('POST', '/api/v1/events', 201, 150);

// Authentication logging
logAuth('login', userId, true, { ip, userAgent });

// Database operation logging
logDatabase('SELECT', 'users', duration);

// Performance logging
logPerformance('heavyOperation', duration);
```

For detailed monitoring documentation, see [MONITORING.md](./MONITORING.md)

## API Documentation

### Interactive Documentation
The API includes comprehensive Swagger/OpenAPI documentation available at:
- **Development**: `http://localhost:80/api-docs`
- **Production**: `https://api.eventmanagement.com/api-docs`

### Documentation Features
- **Interactive Testing**: Test API endpoints directly from the browser
- **Request/Response Examples**: Complete examples for all endpoints
- **Schema Definitions**: Detailed data models and validation rules
- **Authentication Guide**: Step-by-step authentication instructions
- **Error Handling**: Comprehensive error response documentation

### API Documentation Files
- `API_DOCUMENTATION.md` - Comprehensive API guide with examples
- `src/config/swagger.ts` - Swagger configuration and schemas
- Route files contain detailed JSDoc comments for each endpoint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.