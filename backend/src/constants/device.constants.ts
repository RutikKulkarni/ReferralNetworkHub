/**
 * Device & Browser Detection Constants
 * Constants for tracking user devices, browsers, and operating systems
 */

// ==================== DEVICE TYPES ====================

export const DEVICE_TYPES = {
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  UNKNOWN: "UNKNOWN",
} as const;

export type DeviceType = (typeof DEVICE_TYPES)[keyof typeof DEVICE_TYPES];

// ==================== BROWSER TYPES ====================

export const BROWSER_TYPES = {
  CHROME: "CHROME",
  FIREFOX: "FIREFOX",
  SAFARI: "SAFARI",
  EDGE: "EDGE",
  OPERA: "OPERA",
  IE: "IE",
  OTHER: "OTHER",
} as const;

export type BrowserType = (typeof BROWSER_TYPES)[keyof typeof BROWSER_TYPES];

// ==================== OS TYPES ====================

export const OS_TYPES = {
  WINDOWS: "WINDOWS",
  MAC_OS: "MAC_OS",
  LINUX: "LINUX",
  UBUNTU: "UBUNTU",
  CHROME_OS: "CHROME_OS",
  IOS: "IOS",
  ANDROID: "ANDROID",
  WINDOWS_PHONE: "WINDOWS_PHONE",
  OTHER: "OTHER",
} as const;

export type OsType = (typeof OS_TYPES)[keyof typeof OS_TYPES];
