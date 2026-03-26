# Frontend Authentication Implementation

## Overview

Professional, enterprise-grade authentication system using **Cookie-based HttpOnly tokens** with React Context and TanStack Query.

## 🏗️ Architecture

### Technology Stack

- **State Management**: React Context + TanStack Query
- **HTTP Client**: Axios with interceptors
- **Form Validation**: React Hook Form + Zod
- **Token Storage**:
  - Refresh Token: HttpOnly Cookie (XSS-safe)
  - Access Token: In-memory (React Context)
  - User Info: localStorage (non-sensitive data)

### Security Features

✅ HttpOnly cookies prevent XSS attacks  
✅ Automatic token refresh on 401 errors  
✅ Request queuing during token refresh  
✅ CSRF protection via SameSite cookies  
✅ No sensitive data in localStorage  
✅ Short-lived access tokens (1 hour)  
✅ Long-lived refresh tokens (7 days)

## 📁 File Structure

```
src/
├── lib/
│   └── axios.ts              # Axios config with cookie support & interceptors
├── types/
│   └── auth.types.ts         # TypeScript interfaces (User, ApiResponse, etc.)
├── hooks/
│   └── useAuthQueries.ts     # TanStack Query hooks (login, register, logout)
├── contexts/
│   └── AuthContext.tsx       # Auth state management with Context API
├── providers/
│   └── QueryClientProvider.tsx  # TanStack Query client wrapper
├── components/
│   └── ProtectedRoute.tsx    # HOC for protected routes
└── app/
    ├── layout.tsx            # Root layout with providers
    ├── (auth)/
    │   ├── login/page.tsx    # Login page with integrated auth
    │   └── signup/page.tsx   # Signup page with integrated auth
    └── dashboard/page.tsx    # Example protected page
```

## 🚀 Quick Start

### 1. Environment Setup

Create/update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Start Development

```bash
# Ensure backend is running on port 5000
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

### 3. Test Authentication

1. Navigate to http://localhost:3000/signup
2. Create an account
3. You'll be redirected to dashboard
4. Refresh the page - you'll stay logged in (cookie-based persistence)
5. Test logout functionality

## 💡 Usage Examples

### Using Auth Context

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LoginComponent() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login({
        email: "user@example.com",
        password: "SecurePass123!",
      });
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Login failed");
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Protected Routes

```tsx
"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Using TanStack Query Directly

```tsx
"use client";

import { useLogin, useCurrentUser } from "@/hooks/useAuthQueries";
import { useQueryClient } from "@tanstack/react-query";

export function CustomAuthComponent() {
  const loginMutation = useLogin();
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    loginMutation.mutate(
      { email: "user@example.com", password: "pass" },
      {
        onSuccess: () => {
          console.log("Logged in!");
          queryClient.invalidateQueries(["auth", "user"]);
        },
      },
    );
  };

  return (
    <div>
      {isLoading ? "Loading..." : user?.firstName}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

## 🔐 Authentication Flow

### Login Flow

1. User submits credentials
2. Frontend sends POST `/api/auth/login` with `withCredentials: true`
3. Backend validates credentials
4. Backend sets HttpOnly cookie with refresh token
5. Backend returns access token + user data in response body
6. Frontend stores:
   - Access token in memory (React Context)
   - User info in localStorage
7. User redirected to dashboard

### Token Refresh Flow

1. User makes API request
2. If 401 error received:
   - Axios interceptor triggers
   - Queues all pending requests
   - Sends POST `/api/auth/refresh-token` (cookie sent automatically)
   - Backend validates refresh token from cookie
   - Backend returns new access token
   - Frontend updates access token in memory
   - Retries all queued requests with new token

### Logout Flow

1. User clicks logout
2. Frontend sends POST `/api/auth/logout` with cookie
3. Backend clears refresh token cookie (Max-Age=0)
4. Frontend clears:
   - Access token from memory
   - User info from localStorage
   - All TanStack Query cache
5. User redirected to login page

## 🎯 API Endpoints Used

| Endpoint              | Method | Cookie Sent | Cookie Received | Description                                |
| --------------------- | ------ | ----------- | --------------- | ------------------------------------------ |
| `/auth/register`      | POST   | No          | Yes             | Create account, get refresh token cookie   |
| `/auth/login`         | POST   | No          | Yes             | Login, get refresh token cookie            |
| `/auth/refresh-token` | POST   | Yes         | Yes             | Refresh access token, rotate refresh token |
| `/auth/logout`        | POST   | Yes         | Yes (Max-Age=0) | Clear cookie, invalidate session           |
| `/auth/me`            | GET    | Yes         | No              | Get current user info                      |

## 🧪 Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] Signup new account
- [ ] Access protected route when logged in
- [ ] Access protected route when not logged in (redirect to login)
- [ ] Refresh page while logged in (session persists)
- [ ] Automatic token refresh on 401 error
- [ ] Logout functionality
- [ ] Multiple tabs (session shared via cookie)
- [ ] Cookie expires after 7 days (logout required)
- [ ] Access token expires after 1 hour (auto-refresh)

## 🐛 Troubleshooting

### "Network Error" or CORS issues

- Verify backend is running on correct port (5000)
- Check backend CORS configuration has `credentials: true`
- Ensure `withCredentials: true` in axios config

### Cookie not being set

- Check browser Network tab → Response Headers for `Set-Cookie`
- Verify same-origin or proper CORS setup
- Check browser cookie settings (third-party cookies enabled)

### Cookie not being sent with requests

- Verify `withCredentials: true` in axios config
- Check browser Network tab → Request Headers for `Cookie`
- Ensure SameSite policy allows cookie transmission

### Token not refreshing automatically

- Check axios interceptor is configured correctly
- Verify refresh endpoint doesn't require request body
- Check browser console for refresh errors

### User not persisting after refresh

- Check localStorage for 'user' key
- Verify refresh token cookie exists in browser
- Check console for auto-refresh errors on page load

## 📚 Key Components

### AuthContext.tsx

- Manages global auth state (user, accessToken, isAuthenticated, isLoading)
- Provides login, register, logout, refreshAuth functions
- Auto-refreshes token on mount
- Listens for logout events from axios interceptor

### axios.ts

- Configures Axios with `withCredentials: true`
- Adds Authorization header with access token to all requests
- Intercepts 401 errors and triggers token refresh
- Queues failed requests during token refresh
- Retries requests after successful refresh

### useAuthQueries.ts

- `useLogin()` - Login mutation
- `useRegister()` - Registration mutation
- `useLogout()` - Logout mutation
- `useRefreshToken()` - Token refresh mutation
- `useCurrentUser()` - Query current user data

### ProtectedRoute.tsx

- HOC that wraps protected pages
- Shows loading spinner while checking auth
- Redirects to login if not authenticated
- Prevents rendering protected content unless logged in

## 🎬 Next Steps

1. **Add Password Reset Flow**
   - Forgot password endpoint
   - Reset password with token

2. **Add Email Verification**
   - Verify email on signup
   - Resend verification email

3. **Add Role-Based Access Control**
   - Check user.userType in ProtectedRoute
   - Create RoleProtectedRoute component

4. **Add Remember Me**
   - Extend refresh token expiry
   - Store preference in localStorage

5. **Add Social Login**
   - GitHub OAuth flow
   - LinkedIn OAuth flow

## 📖 Related Documentation

- Backend Implementation: `backend/COOKIE_AUTH_IMPLEMENTATION.md`
- TanStack Query Docs: https://tanstack.com/query
- Axios Documentation: https://axios-http.com
- Next.js App Router: https://nextjs.org/docs/app

## 🔒 Security Best Practices

✅ **Implemented:**

- HttpOnly cookies for refresh tokens
- Short-lived access tokens (1 hour)
- Automatic token rotation
- CSRF protection via SameSite
- XSS protection (no tokens in localStorage)
- Request queuing during refresh
- Error handling and user feedback

⚠️ **Additional Recommendations:**

- Enable HTTPS in production
- Implement rate limiting on auth endpoints (already done in backend)
- Add CAPTCHA for login/signup
- Implement session monitoring and anomaly detection
- Add 2FA for sensitive operations
- Log authentication events for audit trail

---

**Built with ❤️ using modern web standards and industry best practices**
