import { Request, Response, NextFunction } from "express";
import { randomBytes, createHmac } from "crypto";

const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.COOKIE_ENCRYPTION_KEY || "";

function generateToken(secret: string): string {
  const random = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", secret).update(random).digest("hex");
  return `${random}.${signature}`;
}

function verifyToken(token: string, secret: string): boolean {
  const [random, signature] = token.split(".");
  if (!random || !signature) return false;
  const expected = createHmac("sha256", secret).update(random).digest("hex");
  return signature === expected;
}

/**
 * Sets a CSRF token cookie on every response.
 * The cookie is NOT httpOnly so the frontend JS can read it
 * and send it back in the X-CSRF-Token header.
 */
export function csrfSetCookie(req: Request, res: Response, next: NextFunction): void {
  if (!req.cookies[CSRF_COOKIE]) {
    const token = generateToken(CSRF_SECRET);
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }
  next();
}

/**
 * Validates that the X-CSRF-Token header matches the csrf-token cookie.
 * Apply to state-changing routes (POST, PUT, DELETE, PATCH).
 */
export function csrfValidate(req: Request, res: Response, next: NextFunction): void {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const cookieToken = req.cookies[CSRF_COOKIE];
    const headerToken = req.headers[CSRF_HEADER] as string | undefined;

    if (!cookieToken || !headerToken || !verifyToken(headerToken, CSRF_SECRET)) {
      res.status(403).json({ success: false, error: "Invalid or missing CSRF token" });
      return;
    }
  }
  next();
}
