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
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new public user
   *     description: Register as a Job Seeker or Referral Provider without an invite
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegistration'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: User registered successfully
   *                 data:
   *                   $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       409:
   *         description: Email already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/auth/invite/accept:
   *   post:
   *     tags: [Authentication]
   *     summary: Accept an invite and register
   *     description: Register a new user using an invite token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AcceptInviteRequest'
   *     responses:
   *       201:
   *         description: Invite accepted and user registered
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       404:
   *         description: Invalid or expired invite token
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
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Authentication]
   *     summary: User login
   *     description: Authenticate user and receive access token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLogin'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *         headers:
   *           Set-Cookie:
   *             description: Refresh token cookie
   *             schema:
   *               type: string
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     tags: [Authentication]
   *     summary: Refresh access token
   *     description: Get a new access token using a refresh token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Valid refresh token
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     expiresIn:
   *                       type: number
   *       401:
   *         description: Invalid or expired refresh token
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
   * @swagger
   * /api/auth/logout:
   *   post:
   *     tags: [Authentication]
   *     summary: Logout user
   *     description: Logout user and invalidate current session
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
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
   * @swagger
   * /api/auth/me:
   *   get:
   *     tags: [Authentication]
   *     summary: Get current authenticated user
   *     description: Retrieve current user information
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User information retrieved
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
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
