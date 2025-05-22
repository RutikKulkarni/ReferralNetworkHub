import type { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../models/user.model";
import PasswordReset from "../models/password-reset.model";
import { validatePassword } from "../utils/password-validator";
import { sendPasswordResetEmail } from "../utils/email-service";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
  deleteAllUserRefreshTokens,
  verifyToken,
} from "../utils/token";
import config from "../config";

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, companyName } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    // Validate required fields based on role
    if (role === "user" && (!firstName || !lastName)) {
      res.status(400).json({
        success: false,
        message: "First name and last name are required for users",
      });
      return;
    }

    if (role === "recruiter" && (!firstName || !lastName || !companyName)) {
      res.status(400).json({
        success: false,
        message:
          "Company name, full name, and work email are required for recruiters",
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      res
        .status(400)
        .json({ success: false, message: passwordValidation.message });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      role: role || "user",
      firstName,
      lastName,
      companyName: role === "recruiter" ? companyName : undefined,
    });

    await user.save();

    // Generate tokens
    const tokenPayload = {
      userId: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token
    await saveRefreshToken(refreshToken, String(user._id));

    // Return tokens in response body (for localStorage)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" && error instanceof Error
          ? error.message
          : undefined,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = (await User.findOne({ email }).lean().exec()) as
      | (IUser & { _id: mongoose.Types.ObjectId })
      | null;
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Check if user is blocked
    if (user.isBlocked) {
      res.status(403).json({
        success: false,
        message:
          "Your account has been blocked. Please contact support for assistance.",
        isBlocked: true,
        reason: user.blockReason,
      });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token
    await saveRefreshToken(refreshToken, String(user._id));

    // Return tokens in response body (for localStorage)
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "Refresh token is required" });
      return;
    }

    // Verify token exists in database
    const tokenDoc = await findRefreshToken(refreshToken);
    if (!tokenDoc) {
      res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
      return;
    }

    // Verify token
    try {
      const decoded = verifyToken(refreshToken, config.jwt.refreshSecret);

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
        await deleteRefreshToken(refreshToken);
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // Check if user is blocked
      if (user.isBlocked) {
        await deleteRefreshToken(refreshToken);
        res.status(403).json({
          success: false,
          message:
            "Your account has been blocked. Please contact support for assistance.",
          isBlocked: true,
          reason: user.blockReason,
        });
        return;
      }

      // Generate new access token
      const tokenPayload = {
        userId: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const accessToken = generateAccessToken(tokenPayload);

      res.status(200).json({
        success: true,
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
        },
      });
    } catch (error) {
      // Token is invalid or expired
      await deleteRefreshToken(refreshToken);
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
      return;
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Public
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from database
      await deleteRefreshToken(refreshToken);
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};

/**
 * Validate access token
 * @route POST /api/auth/validate-token
 * @access Public
 */
export const validateToken = async (req: Request, res: Response) => {
  try {
    // Token should be sent in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ valid: false, message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    try {
      const decoded = verifyToken(token, config.jwt.secret);

      res.status(200).json({
        valid: true,
        userId: decoded.userId,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      });
    } catch (error) {
      res
        .status(401)
        .json({ valid: false, message: "Invalid or expired token" });
      return;
    }
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({
      valid: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};

/**
 * Update user profile data in auth service
 * @route PUT /api/auth/users/:userId/profile
 * @access Private (Service)
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email } = req.body;

    // Update user data
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      res.status(200).json({
        success: true,
        message:
          "If your email is registered, you will receive a password reset link shortly",
      });
      return;
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the token to the database
    await PasswordReset.findOneAndDelete({ email }); // Remove any existing tokens
    await new PasswordReset({
      email,
      token: resetToken,
    }).save();

    // Generate reset link
    const resetLink = `${config.clientUrl}/reset-password?token=${resetToken}&email=${email}`;

    // Send email with reset link
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message:
        "If your email is registered, you will receive a password reset link shortly",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Token, email, and new password are required",
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      res
        .status(400)
        .json({ success: false, message: passwordValidation.message });
      return;
    }

    // Find the reset token
    const resetRequest = await PasswordReset.findOne({ token, email });
    if (!resetRequest) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
      return;
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset token
    await PasswordReset.findOneAndDelete({ token, email });

    // Invalidate all active sessions
    await deleteAllUserRefreshTokens(String(user._id));

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        config.nodeEnv === "development" ? (error as Error).message : undefined,
    });
  }
};
