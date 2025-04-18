import type { Request, Response } from "express";
import User from "../models/user.model";
import RefreshToken from "../models/refresh-token.model";

// Block a user
export const blockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user is already blocked
    if (user.isBlocked) {
      res.status(400).json({ message: "User is already blocked" });
      return;
    }

    // Block the user
    user.isBlocked = true;
    user.blockReason = reason;
    user.blockedAt = new Date();
    await user.save();

    // Invalidate all refresh tokens for this user
    await RefreshToken.deleteMany({ userId });

    res.status(200).json({
      message: "User blocked successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        blockReason: user.blockReason,
        blockedAt: user.blockedAt,
      },
    });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Unblock a user
export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user is already unblocked
    if (!user.isBlocked) {
      res.status(400).json({ message: "User is not blocked" });
      return;
    }

    // Unblock the user
    user.isBlocked = false;
    user.blockReason = undefined;
    user.blockedAt = undefined;
    await user.save();

    res.status(200).json({
      message: "User unblocked successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all blocked users
export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find({ isBlocked: true })
      .select(
        "_id email firstName lastName role blockReason blockedAt createdAt"
      )
      .sort({ blockedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments({ isBlocked: true });

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get blocked users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
