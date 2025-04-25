import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production" ? "none" : ("lax" as "none" | "lax"),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.COOKIE_DOMAIN || undefined
      : undefined,
};

// Access token cookie config (shorter lifespan)
const accessTokenCookieConfig: CookieOptions = {
  ...cookieConfig,
  maxAge: 60 * 60 * 1000, // 1 hour
};

export { cookieConfig, accessTokenCookieConfig };
