import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Event Management API',
    version: '1.0.0',
    description: 'A comprehensive event management system API with authentication, venues, events, and more.',
    contact: {
      name: 'API Support',
      email: 'support@eventmanagement.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.API_BASE_URL || 'http://localhost:8080',
      description: 'Development server'
    },
    {
      url: 'https://api.eventmanagement.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme'
      }
    },
    schemas: {
      // Common response schemas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully'
          },
          data: {
            type: 'object',
            description: 'Response data (varies by endpoint)'
          }
        },
        required: ['success', 'message']
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'An error occurred'
          },
          error: {
            type: 'string',
            example: 'Detailed error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email'
                },
                message: {
                  type: 'string',
                  example: 'Invalid email format'
                }
              }
            },
            description: 'Validation errors (for 400 responses)'
          }
        },
        required: ['success', 'message']
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Validation failed'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email'
                },
                message: {
                  type: 'string',
                  example: 'Invalid email format'
                }
              }
            }
          }
        },
        required: ['success', 'message', 'errors']
      },
      // Auth-related schemas
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          name: {
            type: 'string',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com'
          },
          phone: {
            type: 'string',
            nullable: true,
            example: '+1234567890'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          }
        },
        required: ['id', 'name', 'email', 'createdAt', 'updatedAt']
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          expiresIn: {
            type: 'number',
            example: 3600,
            description: 'Token expiration time in seconds'
          }
        },
        required: ['accessToken', 'refreshToken', 'expiresIn']
      },
      Admin: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          name: {
            type: 'string',
            example: 'Admin User'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@admin.com'
          },
          phone: {
            type: 'string',
            nullable: true,
            example: '+1234567890'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          }
        },
        required: ['id', 'name', 'email', 'createdAt']
      }
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints'
    },
    {
      name: 'Events',
      description: 'Event booking and management endpoints'
    },
    {
      name: 'Meals',
      description: 'Meal options and catering management endpoints'
    },
    {
      name: 'Venues',
      description: 'Venue management endpoints by Admin'
    },
    {
      name: 'Admin',
      description: 'Admin authentication and profile management endpoints'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/api/v1/routes/*.ts',
    './src/api/v1/controllers/*.ts',
    './src/schemas/*.ts',
    './src/docs/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);