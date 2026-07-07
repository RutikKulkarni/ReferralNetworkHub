import { Response, Request, CookieOptions } from "express";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import config from "../../config";

export class CookieUtil {
  private static readonly REFRESH_TOKEN_COOKIE = "refreshToken";
  private static readonly ENCRYPTION_ALGORITHM = "aes-256-gcm";
  private static readonly IV_LENGTH = 12;
  private static readonly AUTH_TAG_LENGTH = 16;

  private static getEncryptionKey(): Buffer {
    const key = process.env.COOKIE_ENCRYPTION_KEY;
    if (!key) {
      throw new Error("COOKIE_ENCRYPTION_KEY is not configured");
    }
    const keyBuffer = Buffer.from(key, "hex");
    if (keyBuffer.length !== 32) {
      throw new Error("COOKIE_ENCRYPTION_KEY must be a 32-byte hex string");
    }
    return keyBuffer;
  }

  private static encryptCookieValue(value: string): string {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(
      this.ENCRYPTION_ALGORITHM,
      this.getEncryptionKey(),
      iv,
    );
    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
  }

  private static decryptCookieValue(value: string): string | undefined {
    try {
      const [ivB64, authTagB64, encryptedB64] = value.split(".");
      if (!ivB64 || !authTagB64 || !encryptedB64) {
        return undefined;
      }
      const iv = Buffer.from(ivB64, "base64");
      const authTag = Buffer.from(authTagB64, "base64");
      const encrypted = Buffer.from(encryptedB64, "base64");
      if (iv.length !== this.IV_LENGTH || authTag.length !== this.AUTH_TAG_LENGTH) {
        return undefined;
      }
      const decipher = createDecipheriv(
        this.ENCRYPTION_ALGORITHM,
        this.getEncryptionKey(),
        iv,
      );
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted.toString("utf8");
    } catch {
      return undefined;
    }
  }

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
   * Set refresh token cookie (encrypted)
   */
  public static setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    expiresIn?: number,
  ): void {
    const encryptedRefreshToken = this.encryptCookieValue(refreshToken);
    res.cookie(
      this.REFRESH_TOKEN_COOKIE,
      encryptedRefreshToken,
      this.getCookieOptions(expiresIn),
    );
  }

  /**
   * Clear refresh token cookie (logout)
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
   * Get and decrypt refresh token from cookie
   */
  public static getRefreshTokenFromCookie(req: Request): string | undefined {
    const encryptedToken = (req as Request & { cookies?: Record<string, string> })
      .cookies?.[this.REFRESH_TOKEN_COOKIE];
    if (!encryptedToken) {
      return undefined;
    }
    return this.decryptCookieValue(encryptedToken);
  }
}

export default CookieUtil;
