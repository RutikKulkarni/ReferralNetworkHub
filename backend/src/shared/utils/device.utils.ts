/**
 * Device Detection Utility Functions
 * Parses User-Agent strings and detects device, browser, and OS information
 */

import { Request } from "express";
import { DeviceInfo, BrowserType, OSType, DeviceType } from "../types";
import { BROWSER_TYPES, OS_TYPES, DEVICE_TYPES } from "../../constants";

export class DeviceUtil {
  /**
   * Parse User-Agent string to extract device information
   */
  public static parseUserAgent(userAgent: string): DeviceInfo {
    const browser = this.detectBrowser(userAgent) as BrowserType;
    const os = this.detectOS(userAgent) as OSType;
    const deviceType = this.detectDeviceType(userAgent) as DeviceType;

    return {
      userAgent,
      browser,
      os,
      deviceType,
      browserVersion: "",
      osVersion: "",
    };
  }

  /**
   * Get device info from Express request
   */
  public static getDeviceInfo(req: Request): DeviceInfo {
    const userAgent = req.get("User-Agent") || "Unknown";
    const ip = this.getClientIP(req);

    const deviceInfo = this.parseUserAgent(userAgent);

    // Return a new object with ip included
    return {
      ...deviceInfo,
      ip,
    };
  }

  /**
   * Detect browser from User-Agent
   */
  private static detectBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes("edg/")) {
      return BROWSER_TYPES.EDGE;
    } else if (ua.includes("chrome/") && !ua.includes("edg/")) {
      return BROWSER_TYPES.CHROME;
    } else if (ua.includes("firefox/")) {
      return BROWSER_TYPES.FIREFOX;
    } else if (ua.includes("safari/") && !ua.includes("chrome/")) {
      return BROWSER_TYPES.SAFARI;
    } else if (ua.includes("opera/") || ua.includes("opr/")) {
      return BROWSER_TYPES.OPERA;
    } else if (ua.includes("msie") || ua.includes("trident/")) {
      return BROWSER_TYPES.IE;
    }

    return BROWSER_TYPES.OTHER;
  }

  /**
   * Detect operating system from User-Agent
   */
  private static detectOS(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes("windows")) {
      if (ua.includes("windows nt 10.0")) return "Windows 10/11";
      if (ua.includes("windows nt 6.3")) return "Windows 8.1";
      if (ua.includes("windows nt 6.2")) return "Windows 8";
      if (ua.includes("windows nt 6.1")) return "Windows 7";
      return OS_TYPES.WINDOWS;
    } else if (ua.includes("mac os x")) {
      const version = ua.match(/mac os x (\d+[._]\d+)/);
      return version
        ? `macOS ${version[1].replace("_", ".")}`
        : OS_TYPES.MAC_OS;
    } else if (ua.includes("linux")) {
      if (ua.includes("android")) {
        const version = ua.match(/android (\d+(\.\d+)?)/);
        return version ? `Android ${version[1]}` : OS_TYPES.ANDROID;
      }
      return OS_TYPES.LINUX;
    } else if (ua.includes("iphone") || ua.includes("ipad")) {
      const version = ua.match(/os (\d+_\d+)/);
      return version ? `iOS ${version[1].replace("_", ".")}` : OS_TYPES.IOS;
    }

    return OS_TYPES.OTHER;
  }

  /**
   * Detect device type from User-Agent
   */
  private static detectDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return DEVICE_TYPES.MOBILE;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return DEVICE_TYPES.TABLET;
    }

    return DEVICE_TYPES.DESKTOP;
  }

  /**
   * Get client IP address
   */
  private static getClientIP(req: Request): string | undefined {
    const forwarded = req.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }

    const realIP = req.get("x-real-ip");
    if (realIP) {
      return realIP;
    }

    return req.ip;
  }

  /**
   * Generate device fingerprint
   */
  public static generateDeviceFingerprint(deviceInfo: DeviceInfo): string {
    const components = [
      deviceInfo.browser,
      deviceInfo.os,
      deviceInfo.deviceType,
      deviceInfo.ip || "unknown",
    ];

    return Buffer.from(components.join("|")).toString("base64");
  }

  /**
   * Compare two device fingerprints
   */
  public static isSameDevice(
    fingerprint1: string,
    fingerprint2: string,
  ): boolean {
    return fingerprint1 === fingerprint2;
  }

  /**
   * Check if device info matches stored info
   */
  public static isDeviceMatch(
    currentDevice: DeviceInfo,
    storedDevice: Partial<DeviceInfo>,
  ): boolean {
    if (
      storedDevice.browser &&
      currentDevice.browser !== storedDevice.browser
    ) {
      return false;
    }

    if (storedDevice.os && currentDevice.os !== storedDevice.os) {
      return false;
    }

    if (
      storedDevice.deviceType &&
      currentDevice.deviceType !== storedDevice.deviceType
    ) {
      return false;
    }

    return true;
  }
}

export default DeviceUtil;
