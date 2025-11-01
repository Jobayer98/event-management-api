# Event Management System

A comprehensive event management system built with Node.js, TypeScript, Express, Prisma, and PostgreSQL. This system provides complete authentication, user management, and event booking capabilities for both customers and organizers.

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

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Logging**: Winston
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
- `POST /api/v1/organizer/register` - Register new organizer
- `POST /api/v1/organizer/login` - Organizer login
- `GET /api/v1/organizer/debug/admin` - Debug admin account status

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

## Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Secure authentication with role-based access
- **Input Validation**: Comprehensive request validation with Zod
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Rate Limiting Ready**: Architecture supports rate limiting middleware
- **Security Headers**: Basic security headers configured
- **Environment Variables**: Sensitive data stored in environment variables

## Logging

The application uses Winston for comprehensive logging:
- **Request/Response Logging**: All API requests and responses
- **Error Logging**: Detailed error tracking with stack traces
- **Security Logging**: Authentication attempts and security events
- **Database Logging**: Database operations and connection status
- **File Logging**: Logs stored in `logs/` directory

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