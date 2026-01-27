# API Documentation - Swagger Setup

## 📚 Overview

This project uses **Swagger (OpenAPI 3.0)** for comprehensive API documentation. The interactive documentation is automatically generated from JSDoc comments in the codebase.

## 🚀 Accessing API Documentation

### Local Development

Once the server is running, access the Swagger UI at:

```
http://localhost:5000/api-docs
```

### Swagger JSON

Get the raw OpenAPI specification:

```
http://localhost:5000/api-docs.json
```

## 📁 File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── swagger.ts           # Swagger configuration
│   ├── docs/
│   │   └── swagger/
│   │       └── schemas.yaml     # Reusable schemas
│   └── modules/
│       └── auth/
│           └── controllers/
│               └── auth.controller.ts  # Documented endpoints
```

## ✍️ Adding Documentation

### Documenting a Route

Add JSDoc comments with `@swagger` annotations above controller methods:

```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user and receive access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
public async login(req: Request, res: Response) {
  // Implementation
}
```

### Available Tags

- `Authentication` - Auth endpoints (login, register, etc.)
- `Users` - User management
- `Invites` - Invitation management
- `Organizations` - Organization management
- `Jobs` - Job management
- `Referrals` - Referral management
- `Platform Admin` - Platform administration

### Reusable Schemas

Define schemas in `src/docs/swagger/schemas.yaml` and reference them:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
```

Reference in routes:

```yaml
$ref: "#/components/schemas/User"
```

## 🔐 Security

### Bearer Authentication

Protected endpoints use JWT Bearer tokens:

```yaml
security:
  - bearerAuth: []
```

In Swagger UI:

1. Click the "Authorize" button (🔒)
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize"

### Refresh Token

Some endpoints use refresh tokens stored in cookies:

```yaml
security:
  - refreshToken: []
```

## 📋 Common Response Schemas

All endpoints follow consistent response formats:

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🎨 Customization

### Swagger UI Options

Modify in `app.ts`:

```typescript
swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Your API Title",
  customfavIcon: "/favicon.ico",
});
```

### Server URLs

Update in `config/swagger.ts`:

```typescript
servers: [
  {
    url: "http://localhost:5000",
    description: "Development server",
  },
  {
    url: "https://api.yourdomain.com",
    description: "Production server",
  },
];
```

## 🧪 Testing with Swagger

1. **Navigate to Swagger UI** (`/api-docs`)
2. **Authorize** (if needed)
3. **Select an endpoint**
4. **Click "Try it out"**
5. **Fill in parameters**
6. **Click "Execute"**
7. **View response**

## 📦 Dependencies

```json
{
  "swagger-ui-express": "^5.x.x",
  "swagger-jsdoc": "^6.x.x",
  "@types/swagger-ui-express": "^4.x.x",
  "@types/swagger-jsdoc": "^6.x.x"
}
```

## 🔧 Troubleshooting

### Documentation not updating?

1. Restart the server
2. Clear browser cache
3. Check for syntax errors in JSDoc comments

### Schemas not found?

Ensure the path in `swagger.ts` matches your file structure:

```typescript
apis: ["./src/modules/*/controllers/*.ts", "./src/docs/swagger/*.yaml"];
```

### Build errors?

Check TypeScript compilation:

```bash
npm run build
```

## 📚 Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)

## 🎯 Current Documentation Status

✅ **Implemented:**

- Authentication endpoints (register, login, logout, refresh, etc.)
- User schemas
- Session schemas
- Invite schemas
- Error responses

🚧 **To Document:**

- Organization endpoints
- Job endpoints
- Referral endpoints
- Platform admin endpoints

---

**Note:** Always keep documentation in sync with actual API implementation!
