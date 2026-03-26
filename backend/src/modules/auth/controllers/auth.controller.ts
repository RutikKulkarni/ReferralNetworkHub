import { Request, Response, NextFunction } from "express";
import { AuthService, InviteService } from "../services";
import { DeviceUtil, ResponseUtil, CookieUtil } from "../../../shared/utils";
import {
  RegisterRequest,
  LoginRequest,
  AcceptInviteRequest,
  OAuthCallbackRequest,
} from "../../../shared/types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants";

export class AuthController {
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

      // Set refresh token cookie
      CookieUtil.setRefreshTokenCookie(res, result.refreshToken);

      // Return response without refresh token
      return ResponseUtil.created(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
        SUCCESS_MESSAGES.USER_REGISTERED,
      );
    } catch (error) {
      next(error);
    }
  }

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

      // Set refresh token cookie
      CookieUtil.setRefreshTokenCookie(res, result.refreshToken);

      // Return response without refresh token
      return ResponseUtil.created(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
        SUCCESS_MESSAGES.INVITE_ACCEPTED,
      );
    } catch (error) {
      next(error);
    }
  }

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

      // Set refresh token cookie
      CookieUtil.setRefreshTokenCookie(res, result.refreshToken);

      // Return response without refresh token
      return ResponseUtil.success(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
        SUCCESS_MESSAGES.LOGIN_SUCCESS,
      );
    } catch (error) {
      next(error);
    }
  }

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

      // Set refresh token cookie
      CookieUtil.setRefreshTokenCookie(res, result.refreshToken);

      // Return response without refresh token
      return ResponseUtil.success(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
        SUCCESS_MESSAGES.LOGIN_SUCCESS,
      );
    } catch (error) {
      next(error);
    }
  }

  public async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      // Get refresh token from cookie (not body)
      const refreshToken = CookieUtil.getRefreshTokenFromCookie(req);

      if (!refreshToken) {
        return ResponseUtil.unauthorized(
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

      // Set new refresh token cookie
      CookieUtil.setRefreshTokenCookie(res, result.refreshToken);

      // Return response without refresh token
      return ResponseUtil.success(
        res,
        { accessToken: result.accessToken },
        SUCCESS_MESSAGES.TOKEN_REFRESHED,
      );
    } catch (error) {
      next(error);
    }
  }

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

      // Clear refresh token cookie
      CookieUtil.clearRefreshTokenCookie(res);

      return ResponseUtil.success(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

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
