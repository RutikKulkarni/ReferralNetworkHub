import crypto from "crypto";

export class HashUtil {
  /**
   * Create SHA-256 hash of a string
   * Used for storing refresh tokens securely in database
   * @param data - The string to hash
   * @returns Hexadecimal hash string
   */
  public static sha256(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  /**
   * Create SHA-512 hash of a string (stronger hashing)
   * @param data - The string to hash
   * @returns Hexadecimal hash string
   */
  public static sha512(data: string): string {
    return crypto.createHash("sha512").update(data).digest("hex");
  }

  /**
   * Compare a plain string with its hash
   * @param plainText - The plain text to verify
   * @param hash - The hash to compare against
   * @param algorithm - Hash algorithm used (default: sha256)
   * @returns True if match, false otherwise
   */
  public static verifyHash(
    plainText: string,
    hash: string,
    algorithm: "sha256" | "sha512" = "sha256",
  ): boolean {
    const computedHash =
      algorithm === "sha256" ? this.sha256(plainText) : this.sha512(plainText);
    return computedHash === hash;
  }
}

export default HashUtil;
