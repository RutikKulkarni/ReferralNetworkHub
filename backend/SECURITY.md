# Security Guidelines

## 🔐 Credential Management

### Environment Variables

**NEVER** commit the following to the repository:

- `.env` files with actual credentials
- Hardcoded passwords, API keys, or secrets
- JWT secret keys
- Database passwords
- Email service passwords

### Super Admin Seeding

The super admin seeder uses environment variables to prevent credential exposure:

```bash
# Set these in your .env file (NEVER commit .env)
SUPER_ADMIN_EMAIL=your-secure-email@company.com
SUPER_ADMIN_PASSWORD=YourVerySecurePassword123!
SUPER_ADMIN_FIRST_NAME=Your
SUPER_ADMIN_LAST_NAME=Name
```

**⚠️ Production Security:**

1. Generate a strong password (minimum 16 characters, mixed case, numbers, symbols)
2. Store credentials in secure vault (AWS Secrets Manager, Azure Key Vault, etc.)
3. Change the default password immediately after first login
4. Never use the seeded password in production long-term
5. Implement password rotation policy

### Generating Secure Secrets

#### JWT Secrets

```bash
# Generate strong JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Super Admin Password

```bash
# Generate a secure random password
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🛡️ Security Best Practices

### 1. Environment-Specific Configuration

```bash
# Development
cp .env.example .env.local
# Edit .env.local with development credentials

# Production
# Use environment variables from your hosting platform
# AWS: AWS Secrets Manager
# Azure: Azure Key Vault
# Heroku: Config Vars
# Vercel: Environment Variables
```

### 2. Database Security

- Use strong database passwords (not 'postgres')
- Restrict database access to application IPs only
- Enable SSL/TLS for database connections in production
- Regularly backup your database
- Use read replicas for sensitive queries

### 3. JWT Token Security

- Keep access tokens short-lived (1 hour or less)
- Use refresh tokens for extended sessions (7 days max)
- Rotate JWT secrets periodically
- Store refresh tokens securely in database
- Implement token revocation on logout

### 4. Redis Security

- Set a strong Redis password
- Restrict Redis access to application IPs
- Use Redis ACLs in production
- Enable TLS for Redis connections

### 5. API Security

- Rate limiting is enabled by default
- CORS is configured per environment
- Helmet.js is used for security headers
- Input validation on all endpoints
- SQL injection prevention via Sequelize parameterization

## 🚨 Security Incident Response

If credentials are accidentally committed:

1. **Immediately rotate all exposed credentials**
2. **Force push to remove sensitive data** (if recent commit)
3. **Use BFG Repo-Cleaner** for older commits
4. **Notify your security team**
5. **Audit access logs** for unauthorized access
6. **Update `.gitignore`** to prevent future incidents

### Remove Committed Credentials

```bash
# If just committed (WARNING: rewrites history)
git reset --soft HEAD~1
git add .
git commit -m "Remove sensitive data"
git push --force

# For older commits, use BFG Repo-Cleaner
# https://rtyley.github.io/bfg-repo-cleaner/
```

## 📋 Security Checklist

### Before Deployment

- [ ] All secrets in environment variables (not code)
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT secrets generated
- [ ] Database credentials secured
- [ ] Redis password set
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] SSL/TLS certificates configured
- [ ] Super admin password changed from default
- [ ] Security headers configured (Helmet.js)
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (no sensitive data logged)

### Regular Security Maintenance

- [ ] Rotate JWT secrets quarterly
- [ ] Update dependencies monthly (`npm audit`)
- [ ] Review access logs weekly
- [ ] Audit user permissions monthly
- [ ] Backup database daily
- [ ] Test disaster recovery quarterly
- [ ] Review and update security policies annually

## 🔍 Vulnerability Reporting

If you discover a security vulnerability, please email:
**security@referralnetworkhub.com**

**DO NOT** open a public issue for security vulnerabilities.

### What to Include

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if known)

We will respond within 48 hours and work with you to resolve the issue.

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Sequelize Security](https://sequelize.org/docs/v6/other-topics/security/)

---

**Last Updated**: January 31, 2026
