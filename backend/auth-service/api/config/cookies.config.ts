import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
  domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
};

const accessTokenCookieConfig: CookieOptions = {
  ...cookieConfig,
  maxAge: 60 * 60 * 1000, // 1 hour
};

export { cookieConfig, accessTokenCookieConfig };
