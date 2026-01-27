/**
 * Swagger Configuration
 * OpenAPI 3.0 specification for Referral Network Hub API
 */

import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Referral Network Hub API",
    version,
    description:
      "Comprehensive API documentation for Referral Network Hub - A multi-tenant platform for managing job referrals, recruitment, and employee networks.",
    contact: {
      name: "API Support",
      email: "support@referralnetworkhub.com",
    },
    license: {
      name: "ISC",
      url: "https://opensource.org/licenses/ISC",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
    {
      url: "https://api.referralnetworkhub.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Invites",
      description: "Invitation management endpoints",
    },
    {
      name: "Organizations",
      description: "Organization management endpoints",
    },
    {
      name: "Jobs",
      description: "Job posting and management endpoints",
    },
    {
      name: "Referrals",
      description: "Referral management endpoints",
    },
    {
      name: "Platform Admin",
      description: "Platform administration endpoints",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT access token for authentication",
      },
      refreshToken: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "Refresh token stored in HTTP-only cookie",
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Access token is missing or invalid",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Unauthorized access",
                },
              },
            },
          },
        },
      },
      ForbiddenError: {
        description: "User does not have permission to access this resource",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Insufficient permissions for this action",
                },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Resource not found",
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Validation error",
                },
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: {
                        type: "string",
                        example: "email",
                      },
                      message: {
                        type: "string",
                        example: "Invalid email format",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    "./src/modules/*/routes/*.ts",
    "./src/modules/*/controllers/*.ts",
    "./src/docs/swagger/*.yaml",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
