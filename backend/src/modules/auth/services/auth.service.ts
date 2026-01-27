/**
 * Authentication Service
 * Handles user registration, login, token management, and authentication flows
 */

import crypto from "crypto";
import { Op } from "sequelize";
import {
  User,
  UserSession,
  RefreshToken,
  InviteToken,
  EmailVerification,
} from "../models";
import { JWTUtil, PasswordUtil, ValidationUtil } from "../../../shared/utils";
import {
  USER_TYPES,
  SESSION_TRACKED_USER_TYPES,
  INVITE_STATUS,
  INVITE_TYPES,
  EMAIL_VERIFICATION_STATUS,
  TOKEN_EXPIRY,
  SESSION_LIMITS,
  ERROR_MESSAGES,
} from "../../../constants";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  DeviceInfo,
  AcceptInviteRequest,
  OAuthCallbackRequest,
  UserType,
} from "../../../shared/types";
import config from "../../../config";

export class AuthService {
  /**
   * Register public user (Job Seeker or Referral Provider)
   */
  public async registerPublicUser(
    data: RegisterRequest,
    deviceInfo: DeviceInfo,
  ): Promise<LoginResponse> {
    const { email, password, firstName, lastName, phone, userType } = data;

    // Validate user type is public
    if (
      userType !== USER_TYPES.JOB_SEEKER &&
      userType !== USER_TYPES.REFERRAL_PROVIDER
    ) {
      throw new Error(ERROR_MESSAGES.INVALID_USER_TYPE);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Validate password
    const passwordValidation = PasswordUtil.validatePassword(password, {
      email,
      firstName,
      lastName,
    });
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hashPassword(password);

    // Create user
    const user = await User.create({
      userType,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      emailVerified: false,
      isActive: true,
      isBlocked: false,
      tokenVersion: 0,
    });

    // Generate access and refresh tokens
    const tokens = await this.generateTokensForUser(user, deviceInfo);

    return {
      user: this.userToLoginResponseUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: config.jwt.accessTokenExpiry,
    };
  }

  /**
   * Register user with invite token
   */
  public async registerWithInvite(
    data: AcceptInviteRequest,
    deviceInfo: DeviceInfo,
  ): Promise<LoginResponse> {
    const { token, password, firstName, lastName, phone } = data;

    // Find and validate invite
    const invite = await InviteToken.findOne({
      where: { token, status: INVITE_STATUS.PENDING },
    });

    if (!invite) {
      throw new Error(ERROR_MESSAGES.INVALID_INVITE_TOKEN);
    }

    if (!invite.isValid()) {
      throw new Error(ERROR_MESSAGES.INVITE_EXPIRED);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: invite.email } });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Determine user type from invite type
    const userType = this.getUserTypeFromInviteType(invite.inviteType);

    // Validate password
    const passwordValidation = PasswordUtil.validatePassword(password, {
      email: invite.email,
      firstName,
      lastName,
    });
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hashPassword(password);

    // Create user
    const user = await User.create({
      userType,
      email: invite.email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      emailVerified: true, // Auto-verify for invite-based registration
      organizationId: invite.organizationId,
      invitedBy: invite.invitedBy,
      isActive: true,
      isBlocked: false,
      tokenVersion: 0,
    });

    // Mark invite as accepted
    await invite.accept(user.id);

    // Generate tokens
    const tokens = await this.generateTokensForUser(user, deviceInfo);

    return {
      user: this.userToLoginResponseUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: config.jwt.accessTokenExpiry,
    };
  }

  /**
   * Register organization admin with email domain verification
   */
  public async registerOrgAdmin(
    data: RegisterRequest,
    allowedDomains: string[],
    _deviceInfo: DeviceInfo,
  ): Promise<{
    user: Omit<typeof User.prototype, "password">;
    verificationToken: string;
  }> {
    const { email, password, firstName, lastName, phone } = data;

    // Validate email domain
    if (!ValidationUtil.isValidEmailDomain(email, allowedDomains)) {
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL_DOMAIN);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Validate password
    const passwordValidation = PasswordUtil.validatePassword(password, {
      email,
      firstName,
      lastName,
    });
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hashPassword(password);

    // Create user (inactive until email verified)
    const user = await User.create({
      userType: USER_TYPES.ORGANIZATION_ADMIN,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      emailVerified: false,
      emailVerificationStatus: EMAIL_VERIFICATION_STATUS.PENDING,
      isActive: false, // Inactive until verified
      isBlocked: false,
      tokenVersion: 0,
    });

    // Generate verification token
    const verificationToken = this.generateSecureToken();
    const expiresAt = new Date(
      Date.now() + this.parseExpiry(TOKEN_EXPIRY.ORG_ADMIN_INVITE),
    );

    await EmailVerification.create({
      userId: user.id,
      email: user.email,
      token: verificationToken,
      status: EMAIL_VERIFICATION_STATUS.PENDING,
      expiresAt,
    });

    return {
      user,
      verificationToken,
    };
  }

  /**
   * Login user
   */
  public async login(
    data: LoginRequest,
    deviceInfo: DeviceInfo,
  ): Promise<LoginResponse> {
    const { email, password } = data;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if OAuth user
    if (!user.password && user.oauthProvider) {
      throw new Error(ERROR_MESSAGES.OAUTH_USER_PASSWORD_LOGIN);
    }

    // Verify password
    if (!user.password) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await PasswordUtil.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user can login
    const loginCheck = user.canLogin();
    if (!loginCheck.allowed) {
      throw new Error(loginCheck.reason || ERROR_MESSAGES.ACCOUNT_INACTIVE);
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const tokens = await this.generateTokensForUser(user, deviceInfo);

    return {
      user: this.userToLoginResponseUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: config.jwt.accessTokenExpiry,
    };
  }

  /**
   * OAuth login/register
   */
  public async oauthLogin(
    data: OAuthCallbackRequest,
    deviceInfo: DeviceInfo,
  ): Promise<LoginResponse> {
    const { provider, providerId, email, firstName, lastName, profilePicture } =
      data;

    // Find or create user
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { oauthProvider: provider, oauthProviderId: providerId },
          { email },
        ],
      },
    });

    if (user) {
      // Update OAuth info if needed
      if (!user.oauthProvider) {
        user.oauthProvider = provider || null;
        user.oauthProviderId = providerId || null;
        user.emailVerified = true;
        await user.save();
      }

      // Check if user can login
      const loginCheck = user.canLogin();
      if (!loginCheck.allowed) {
        throw new Error(loginCheck.reason || ERROR_MESSAGES.ACCOUNT_INACTIVE);
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // Create new user (default to JOB_SEEKER for OAuth)
      user = await User.create({
        userType: USER_TYPES.JOB_SEEKER,
        email: email || "",
        password: null,
        firstName: firstName || "",
        lastName: lastName || "",
        profilePicture: profilePicture || null,
        emailVerified: true,
        oauthProvider: provider || null,
        oauthProviderId: providerId || null,
        isActive: true,
        isBlocked: false,
        tokenVersion: 0,
      });
    }

    // Generate tokens
    const tokens = await this.generateTokensForUser(user, deviceInfo);

    return {
      user: this.userToLoginResponseUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: config.jwt.accessTokenExpiry,
    };
  }

  /**
   * Refresh access token
   */
  public async refreshAccessToken(
    refreshToken: string,
    deviceInfo: DeviceInfo,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = JWTUtil.verifyRefreshToken(refreshToken);

    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [{ model: User, as: "user" }],
    });

    if (!storedToken || !storedToken.isValid()) {
      throw new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = storedToken.user;
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check token version
    if (!JWTUtil.isTokenVersionValid(decoded.tokenVersion, user.tokenVersion)) {
      throw new Error(ERROR_MESSAGES.TOKEN_REVOKED);
    }

    // Check if user can login
    const loginCheck = user.canLogin();
    if (!loginCheck.allowed) {
      throw new Error(loginCheck.reason || ERROR_MESSAGES.ACCOUNT_INACTIVE);
    }

    // Generate new token pair
    const newTokens = await this.generateTokensForUser(user, deviceInfo);

    // Revoke old refresh token
    await storedToken.revoke(newTokens.refreshToken);

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  /**
   * Logout user
   */
  public async logout(userId: string, sessionId: string): Promise<void> {
    // Find and logout session
    const session = await UserSession.findOne({
      where: { id: sessionId, userId },
    });

    if (session) {
      await session.logout();
    }

    // Revoke all refresh tokens for this session
    await RefreshToken.update(
      { isRevoked: true, revokedAt: new Date() },
      { where: { userId } },
    );
  }

  /**
   * Generate tokens for user with session tracking
   */
  private async generateTokensForUser(
    user: User,
    deviceInfo: DeviceInfo,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId?: string;
  }> {
    let sessionId: string | undefined;

    // Create session if user requires session tracking
    if ((SESSION_TRACKED_USER_TYPES as readonly UserType[]).includes(user.userType as UserType)) {
      // Check session limit
      const activeSessions = await UserSession.count({
        where: {
          userId: user.id,
          status: "active",
          expiresAt: { [Op.gt]: new Date() },
        },
      });

      if (activeSessions >= SESSION_LIMITS.maxActiveSessionsPerUser) {
        // Remove oldest session
        const oldestSession = await UserSession.findOne({
          where: {
            userId: user.id,
            status: "active",
          },
          order: [["lastActivityAt", "ASC"]],
        });

        if (oldestSession) {
          await oldestSession.expire();
        }
      }

      // Create new session
      const sessionToken = this.generateSecureToken();
      const expiresAt = new Date(
        Date.now() + config.session.expirySeconds * 1000,
      );

      const session = await UserSession.create({
        userId: user.id,
        sessionToken,
        ipAddress: deviceInfo.ip || "unknown",
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        browserVersion: deviceInfo.browserVersion || "",
        os: deviceInfo.os,
        osVersion: deviceInfo.osVersion || "",
        userAgent: deviceInfo.userAgent,
        deviceId: `${deviceInfo.browser}-${deviceInfo.os}-${deviceInfo.deviceType}`,
        loginAt: new Date(),
        status: "active",
        lastActivityAt: new Date(),
        expiresAt,
      });

      sessionId = session.id;
    }

    // Generate JWT tokens
    const tokens = JWTUtil.generateTokenPair(
      user.id,
      user.userType as UserType,
      user.email,
      sessionId,
      user.tokenVersion,
      user.organizationId || undefined,
    );

    // Store refresh token
    const refreshTokenExpiry = new Date(
      Date.now() + this.parseExpiry(config.jwt.refreshTokenExpiry),
    );

    await RefreshToken.create({
      userId: user.id,
      sessionId: sessionId || "",
      token: tokens.refreshToken,
      expiresAt: refreshTokenExpiry,
      isRevoked: false,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId,
    };
  }

  /**
   * Get user type from invite type
   */
  private getUserTypeFromInviteType(inviteType: string): string {
    switch (inviteType) {
      case INVITE_TYPES.PLATFORM_ADMIN:
        return USER_TYPES.PLATFORM_ADMIN;
      case INVITE_TYPES.ORG_ADMIN:
        return USER_TYPES.ORGANIZATION_ADMIN;
      case INVITE_TYPES.ORG_RECRUITER:
        return USER_TYPES.ORG_RECRUITER;
      case INVITE_TYPES.EMPLOYEE:
        return USER_TYPES.EMPLOYEE_REFERRER;
      default:
        throw new Error(ERROR_MESSAGES.INVALID_INVITE_TYPE);
    }
  }

  /**
   * Generate secure random token
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Parse expiry string to milliseconds
   */
  private parseExpiry(expiry: string): number {
    return JWTUtil.parseExpiry(expiry) * 1000;
  }

  /**
   * Convert User model to LoginResponse user format
   */
  private userToLoginResponseUser(user: User): LoginResponse["user"] {
    const safeUser = user.toSafeJSON();
    return {
      id: safeUser.id,
      email: safeUser.email,
      userType: safeUser.userType as UserType,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      emailVerified: safeUser.emailVerified,
      organizationId: safeUser.organizationId || undefined,
    };
  }
}

export default new AuthService();
