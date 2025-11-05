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
      },
      Venue: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          name: {
            type: 'string',
            example: 'Grand Ballroom'
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'Elegant ballroom perfect for weddings and corporate events'
          },
          address: {
            type: 'string',
            example: '123 Main Street, Downtown City'
          },
          city: {
            type: 'string',
            example: 'Dhaka'
          },
          state: {
            type: 'string',
            example: 'Dhaka Division'
          },
          zipCode: {
            type: 'string',
            nullable: true,
            example: '1000'
          },
          country: {
            type: 'string',
            example: 'Bangladesh'
          },
          latitude: {
            type: 'number',
            nullable: true,
            example: 23.8103
          },
          longitude: {
            type: 'number',
            nullable: true,
            example: 90.4125
          },
          capacity: {
            type: 'integer',
            example: 500
          },
          area: {
            type: 'number',
            nullable: true,
            example: 5000.00
          },
          venueType: {
            type: 'string',
            enum: ['indoor', 'outdoor', 'hybrid'],
            example: 'indoor'
          },
          pricePerDay: {
            type: 'number',
            example: 250.00
          },
          minimumDays: {
            type: 'integer',
            example: 1
          },
          securityDeposit: {
            type: 'number',
            nullable: true,
            example: 5000.00
          },
          facilities: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['parking', 'ac', 'wifi', 'sound_system', 'lighting', 'stage', 'kitchen', 'restrooms', 'wheelchair_accessible', 'projector', 'elevator', 'garden']
            },
            example: ['parking', 'ac', 'wifi', 'sound_system']
          },
          amenities: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['bridal_room', 'groom_room', 'vip_lounge', 'dance_floor', 'bar_area', 'outdoor_space']
            },
            example: ['bridal_room', 'dance_floor']
          },
          cateringAllowed: {
            type: 'boolean',
            example: true
          },
          decorationAllowed: {
            type: 'boolean',
            example: true
          },
          alcoholAllowed: {
            type: 'boolean',
            example: false
          },
          smokingAllowed: {
            type: 'boolean',
            example: false
          },
          petFriendly: {
            type: 'boolean',
            example: false
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri'
            },
            example: ['https://example.com/venue1.jpg', 'https://example.com/venue2.jpg']
          },
          virtualTourUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/virtual-tour'
          },
          contactPerson: {
            type: 'string',
            nullable: true,
            example: 'Ahmed Hassan'
          },
          contactPhone: {
            type: 'string',
            nullable: true,
            example: '+8801712345678'
          },
          contactEmail: {
            type: 'string',
            format: 'email',
            nullable: true,
            example: 'contact@venue.com'
          },
          operatingHours: {
            type: 'object',
            nullable: true,
            example: {
              monday: { open: '09:00', close: '23:00' },
              tuesday: { open: '09:00', close: '23:00' }
            }
          },
          isActive: {
            type: 'boolean',
            example: true
          },
          rating: {
            type: 'number',
            nullable: true,
            example: 4.8
          },
          totalReviews: {
            type: 'integer',
            example: 125
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
        required: ['id', 'name', 'address', 'city', 'state', 'country', 'capacity', 'venueType', 'pricePerDay', 'createdAt', 'updatedAt']
      },
      Meal: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          name: {
            type: 'string',
            example: 'Vegetarian Deluxe'
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'Premium vegetarian menu featuring seasonal vegetables'
          },
          type: {
            type: 'string',
            enum: ['veg', 'nonveg', 'buffet', 'plated'],
            example: 'veg'
          },
          cuisine: {
            type: 'string',
            nullable: true,
            example: 'continental'
          },
          servingStyle: {
            type: 'string',
            enum: ['buffet', 'plated', 'family_style'],
            example: 'plated'
          },
          pricePerPerson: {
            type: 'number',
            example: 325.00
          },
          minimumGuests: {
            type: 'integer',
            example: 50
          },
          menuItems: {
            type: 'object',
            nullable: true,
            example: {
              appetizers: ['Vegetable Spring Rolls', 'Hummus with Pita'],
              main_course: ['Quinoa Stuffed Bell Peppers', 'Pasta Primavera'],
              desserts: ['Chocolate Mousse', 'Fresh Fruit Tart']
            }
          },
          beverages: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tea', 'coffee', 'soft_drinks', 'juices', 'water', 'mocktails']
            },
            example: ['tea', 'coffee', 'juices']
          },
          specialDietary: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_free', 'vegan']
            },
            example: ['halal', 'gluten_free']
          },
          serviceHours: {
            type: 'object',
            nullable: true,
            properties: {
              setup: { type: 'number', example: 1 },
              service: { type: 'number', example: 3 },
              cleanup: { type: 'number', example: 1 }
            }
          },
          staffIncluded: {
            type: 'boolean',
            example: true
          },
          equipmentIncluded: {
            type: 'boolean',
            example: true
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri'
            },
            example: ['https://example.com/meal1.jpg', 'https://example.com/meal2.jpg']
          },
          isActive: {
            type: 'boolean',
            example: true
          },
          isPopular: {
            type: 'boolean',
            example: false
          },
          rating: {
            type: 'number',
            nullable: true,
            example: 4.5
          },
          totalReviews: {
            type: 'integer',
            example: 78
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
        required: ['id', 'name', 'type', 'servingStyle', 'pricePerPerson', 'createdAt', 'updatedAt']
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1
          },
          limit: {
            type: 'integer',
            example: 10
          },
          total: {
            type: 'integer',
            example: 25
          },
          pages: {
            type: 'integer',
            example: 3
          }
        },
        required: ['page', 'limit', 'total', 'pages']
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