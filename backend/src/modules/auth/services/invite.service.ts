import crypto from "crypto";
import { InviteToken, User } from "../models";
import {
  INVITE_TYPES,
  INVITE_STATUS,
  USER_TYPES,
  TOKEN_EXPIRY,
  ERROR_MESSAGES,
} from "../../../constants";
import { SendInviteRequest } from "../../../shared/types";
import { ValidationUtil, JWTUtil } from "../../../shared/utils";

// Internal type for create invite with invitedBy
interface CreateInviteData extends Omit<
  SendInviteRequest,
  "inviteType" | "role"
> {
  inviteType: string;
  invitedBy: string;
  role?: string;
  expiry?: string;
}

export class InviteService {
  /**
   * Create platform admin invite (only super admin can do this)
   */
  public async createPlatformAdminInvite(
    email: string,
    invitedBy: string,
  ): Promise<InviteToken> {
    // Validate inviter is super admin
    const inviter = await User.findByPk(invitedBy);
    if (!inviter || inviter.userType !== USER_TYPES.PLATFORM_SUPER_ADMIN) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    return this.createInvite({
      email,
      inviteType: INVITE_TYPES.PLATFORM_ADMIN,
      invitedBy,
    });
  }

  /**
   * Create organization admin invite (super admin or platform admin)
   */
  public async createOrgAdminInvite(
    email: string,
    invitedBy: string,
    organizationId?: string,
  ): Promise<InviteToken> {
    // Validate inviter is super admin or platform admin
    const inviter = await User.findByPk(invitedBy);
    if (
      !inviter ||
      (inviter.userType !== USER_TYPES.PLATFORM_SUPER_ADMIN &&
        inviter.userType !== USER_TYPES.PLATFORM_ADMIN)
    ) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    return this.createInvite({
      email,
      inviteType: INVITE_TYPES.ORG_ADMIN,
      invitedBy,
      organizationId,
      expiry: TOKEN_EXPIRY.ORG_ADMIN_INVITE,
    });
  }

  /**
   * Create recruiter invite (org admin only)
   */
  public async createRecruiterInvite(
    email: string,
    invitedBy: string,
    organizationId: string,
    role?: string,
  ): Promise<InviteToken> {
    // Validate inviter is org admin
    const inviter = await User.findByPk(invitedBy);
    if (!inviter || inviter.userType !== USER_TYPES.ORGANIZATION_ADMIN) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    // Validate org admin belongs to organization
    if (inviter.organizationId !== organizationId) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_TO_INVITE);
    }

    return this.createInvite({
      email,
      inviteType: INVITE_TYPES.ORG_RECRUITER,
      invitedBy,
      organizationId,
      role,
    });
  }

  /**
   * Create employee invite (org admin or recruiter)
   */
  public async createEmployeeInvite(
    email: string,
    invitedBy: string,
    organizationId: string,
    role?: string,
    metadata?: Record<string, unknown>,
  ): Promise<InviteToken> {
    // Validate inviter is org admin or recruiter
    const inviter = await User.findByPk(invitedBy);
    if (
      !inviter ||
      (inviter.userType !== USER_TYPES.ORGANIZATION_ADMIN &&
        inviter.userType !== USER_TYPES.ORG_RECRUITER)
    ) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    // Validate inviter belongs to organization
    if (inviter.organizationId !== organizationId) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_TO_INVITE);
    }

    return this.createInvite({
      email,
      inviteType: INVITE_TYPES.EMPLOYEE,
      invitedBy,
      organizationId,
      role,
      metadata,
    });
  }

  /**
   * Create invite token
   */
  private async createInvite(data: CreateInviteData): Promise<InviteToken> {
    const {
      email,
      inviteType,
      invitedBy,
      organizationId,
      role,
      metadata,
      expiry,
    } = data;

    // Validate email
    if (!ValidationUtil.isValidEmail(email)) {
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Check for pending invites
    const pendingInvite = await InviteToken.findOne({
      where: {
        email,
        status: INVITE_STATUS.PENDING,
      },
    });

    if (pendingInvite && pendingInvite.isValid()) {
      throw new Error(ERROR_MESSAGES.INVITE_ALREADY_SENT);
    }

    // Generate invite token
    const token = this.generateSecureToken();
    const expiryMs = expiry
      ? JWTUtil.parseExpiry(expiry) * 1000
      : JWTUtil.parseExpiry(TOKEN_EXPIRY.INVITE) * 1000;
    const expiresAt = new Date(Date.now() + expiryMs);

    // Create invite
    const invite = await InviteToken.create({
      inviteType,
      email,
      token,
      status: INVITE_STATUS.PENDING,
      organizationId: organizationId || null,
      invitedBy,
      role: role || null,
      expiresAt,
      metadata: metadata || null,
    });

    return invite;
  }

  /**
   * Validate invite token
   */
  public async validateInvite(token: string): Promise<InviteToken> {
    const invite = await InviteToken.findOne({
      where: { token },
      include: [
        {
          model: User,
          as: "inviter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    if (!invite) {
      throw new Error(ERROR_MESSAGES.INVALID_INVITE_TOKEN);
    }

    if (!invite.isValid()) {
      if (invite.isExpired()) {
        throw new Error(ERROR_MESSAGES.INVITE_EXPIRED);
      }
      throw new Error(ERROR_MESSAGES.INVALID_INVITE_TOKEN);
    }

    return invite;
  }

  /**
   * Revoke invite
   */
  public async revokeInvite(
    inviteId: string,
    revokedBy: string,
  ): Promise<void> {
    const invite = await InviteToken.findByPk(inviteId);

    if (!invite) {
      throw new Error(ERROR_MESSAGES.INVITE_NOT_FOUND);
    }

    // Validate revoker has permission
    const revoker = await User.findByPk(revokedBy);
    if (!revoker) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if revoker is the inviter or has higher permissions
    const canRevoke = this.canRevokeInvite(revoker, invite);
    if (!canRevoke) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    await invite.revoke(revokedBy);
  }

  /**
   * Get pending invites for organization
   */
  public async getOrganizationInvites(
    organizationId: string,
    status?: string,
  ): Promise<InviteToken[]> {
    const where: Record<string, unknown> = { organizationId };

    if (status) {
      where.status = status;
    }

    return InviteToken.findAll({
      where,
      include: [
        {
          model: User,
          as: "inviter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Get invites sent by user
   */
  public async getInvitesBySender(
    invitedBy: string,
    status?: string,
  ): Promise<InviteToken[]> {
    const where: Record<string, unknown> = { invitedBy };

    if (status) {
      where.status = status;
    }

    return InviteToken.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Expire old pending invites
   */
  public async expireOldInvites(): Promise<number> {
    const expiredInvites = await InviteToken.findAll({
      where: {
        status: INVITE_STATUS.PENDING,
        expiresAt: { $lt: new Date() } as never,
      },
    });

    for (const invite of expiredInvites) {
      await invite.expire();
    }

    return expiredInvites.length;
  }

  /**
   * Check if user can revoke invite
   */
  private canRevokeInvite(user: User, invite: InviteToken): boolean {
    // Super admin can revoke any invite
    if (user.userType === USER_TYPES.PLATFORM_SUPER_ADMIN) {
      return true;
    }

    // Platform admin can revoke org admin and below invites
    if (
      user.userType === USER_TYPES.PLATFORM_ADMIN &&
      invite.inviteType !== INVITE_TYPES.PLATFORM_ADMIN
    ) {
      return true;
    }

    // Org admin can revoke invites for their organization
    if (
      user.userType === USER_TYPES.ORGANIZATION_ADMIN &&
      user.organizationId === invite.organizationId &&
      (invite.inviteType === INVITE_TYPES.ORG_RECRUITER ||
        invite.inviteType === INVITE_TYPES.EMPLOYEE)
    ) {
      return true;
    }

    // User can revoke their own invites
    if (user.id === invite.invitedBy) {
      return true;
    }

    return false;
  }

  /**
   * Generate secure random token
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}

export default new InviteService();
