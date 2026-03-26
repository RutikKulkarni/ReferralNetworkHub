import { Response, Request, CookieOptions } from "express";
import config from "../../config";

export class CookieUtil {
  private static readonly REFRESH_TOKEN_COOKIE = "refreshToken";

  private static getCookieOptions(maxAge?: number): CookieOptions {
    return {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: config.env === "production" ? "strict" : "lax",
      maxAge: maxAge || 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: config.env === "production" ? config.domain : undefined,
    };
  }

  /**
   * Set refresh token cookie
   * @param res - Express Response object
   * @param refreshToken - JWT refresh token
   * @param expiresIn - Expiry time in milliseconds (default 7 days)
   */
  public static setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    expiresIn?: number,
  ): void {
    res.cookie(
      this.REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.getCookieOptions(expiresIn),
    );
  }

  /**
   * Clear refresh token cookie (logout)
   * @param res - Express Response object
   */
  public static clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: config.env === "production" ? "strict" : "lax",
      path: "/",
      domain: config.env === "production" ? config.domain : undefined,
    });
  }

  /**
   * Get refresh token from cookie
   * @param req - Express Request object
   * @returns Refresh token or undefined
   */
  public static getRefreshTokenFromCookie(req: Request): string | undefined {
    return (req as Request & { cookies?: Record<string, string> }).cookies?.[
      this.REFRESH_TOKEN_COOKIE
    ];
  }
}

export default CookieUtil;
