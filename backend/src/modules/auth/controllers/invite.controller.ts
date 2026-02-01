import { Request, Response, NextFunction } from "express";
import { InviteService } from "../services";
import { ResponseUtil } from "../../../shared/utils";
import { SUCCESS_MESSAGES } from "../../../constants";

export class InviteController {
  public async createPlatformAdminInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email } = req.body;
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const invitedBy = req.user.id;

      const invite = await InviteService.createPlatformAdminInvite(
        email,
        invitedBy,
      );

      return ResponseUtil.created(res, invite, SUCCESS_MESSAGES.INVITE_SENT);
    } catch (error) {
      next(error);
    }
  }

  public async createOrgAdminInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email, organizationId } = req.body;
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const invitedBy = req.user.id;

      const invite = await InviteService.createOrgAdminInvite(
        email,
        invitedBy,
        organizationId,
      );

      return ResponseUtil.created(res, invite, SUCCESS_MESSAGES.INVITE_SENT);
    } catch (error) {
      next(error);
    }
  }
  public async createRecruiterInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email, organizationId, role } = req.body;
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const invitedBy = req.user.id;

      const invite = await InviteService.createRecruiterInvite(
        email,
        invitedBy,
        organizationId,
        role,
      );

      return ResponseUtil.created(res, invite, SUCCESS_MESSAGES.INVITE_SENT);
    } catch (error) {
      next(error);
    }
  }

  public async createEmployeeInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { email, organizationId, role, metadata } = req.body;
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const invitedBy = req.user.id;

      const invite = await InviteService.createEmployeeInvite(
        email,
        invitedBy,
        organizationId,
        role,
        metadata,
      );

      return ResponseUtil.created(res, invite, SUCCESS_MESSAGES.INVITE_SENT);
    } catch (error) {
      next(error);
    }
  }

  public async getOrganizationInvites(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { organizationId } = req.params;
      const { status } = req.query;

      const invites = await InviteService.getOrganizationInvites(
        organizationId as string,
        status as string | undefined,
      );

      return ResponseUtil.success(res, invites);
    } catch (error) {
      next(error);
    }
  }

  public async getMyInvites(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const invitedBy = req.user.id;
      const { status } = req.query;

      const invites = await InviteService.getInvitesBySender(
        invitedBy,
        status as string,
      );

      return ResponseUtil.success(res, invites);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revoke invite
   */
  public async revokeInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { inviteId } = req.params;
      if (!req.user) {
        return ResponseUtil.unauthorized(res, "User not authenticated");
      }
      const revokedBy = req.user.id;

      await InviteService.revokeInvite(inviteId as string, revokedBy);

      return ResponseUtil.success(res, null, SUCCESS_MESSAGES.INVITE_REVOKED);
    } catch (error) {
      next(error);
    }
  }
}

export default new InviteController();
