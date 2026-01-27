/**
 * Authentication Controller
 * Handles all authentication-related HTTP requests
 */

import { Request, Response, NextFunction } from "express";
import { AuthService, InviteService } from "../services";
import { DeviceUtil, ResponseUtil } from "../../../shared/utils";
import {
  RegisterRequest,
  LoginRequest,
  AcceptInviteRequest,
  OAuthCallbackRequest,
} from "../../../shared/types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants";

export class AuthController {
  /**
   * Register public user (Job Seeker or Referral Provider)
   */
  public async registerPublic(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data: RegisterRequest = req.body;

      // Get device info
      const deviceInfo = DeviceUtil.getDeviceInfo(req);

      // Register user
      const result = await AuthService.registerPublicUser(data, deviceInfo);

      return ResponseUtil.created(
        res,
        result,
        SUCCESS_MESSAGES.USER_REGISTERED,
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Accept invite and register
   */
  public async acceptInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data: AcceptInviteRequest = req.body;

      // Get device info
      const deviceInfo = DeviceUtil.getDeviceInfo(req);

      // Register with invite
      const result = await AuthService.registerWithInvite(data, deviceInfo);

      return ResponseUtil.created(
        res,
        result,
        SUCCESS_MESSAGES.INVITE_ACCEPTED,
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate invite token
   */
  public async validateInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { token } = req.params;

      const invite = await InviteService.validateInvite(String(token));

      return ResponseUtil.success(res, {
        email: invite.email,
        inviteType: invite.inviteType,
        organizationId: invite.organizationId,
        expiresAt: invite.expiresAt,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data: LoginRequest = req.body;

      // Get device info
      const deviceInfo = DeviceUtil.getDeviceInfo(req);

      // Login
      const result = await AuthService.login(data, deviceInfo);

      return ResponseUtil.success(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  /**
   * OAuth callback (Google)
   */
  public async oauthCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data: OAuthCallbackRequest = req.body;

      // Get device info
      const deviceInfo = DeviceUtil.getDeviceInfo(req);

      // OAuth login/register
      const result = await AuthService.oauthLogin(data, deviceInfo);

      return ResponseUtil.success(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  public async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return ResponseUtil.badRequest(
          res,
          ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED,
        );
      }

      // Get device info
      const deviceInfo = DeviceUtil.getDeviceInfo(req);

      // Refresh token
      const result = await AuthService.refreshAccessToken(
        refreshToken,
        deviceInfo,
      );

      return ResponseUtil.success(
        res,
        result,
        SUCCESS_MESSAGES.TOKEN_REFRESHED,
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const userId = req.user.id;
      const sessionId = req.sessionInfo?.id;

      if (!sessionId) {
        return ResponseUtil.badRequest(res, ERROR_MESSAGES.SESSION_NOT_FOUND);
      }

      await AuthService.logout(String(userId), sessionId);

      return ResponseUtil.success(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  public async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      return ResponseUtil.success(res, req.user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
