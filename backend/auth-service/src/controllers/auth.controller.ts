import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";
import RefreshToken from "../models/refresh-token.model";
import PasswordReset from "../models/password-reset.model";
import { validatePassword } from "../utils/password-validator";
import { sendPasswordResetEmail } from "../utils/email-service";

// Define type for Express request handler
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, companyName } =
      req.body;

    // Validate required fields for all roles
    if (!firstName || !lastName || !email || !password || !role) {
      res.status(400).json({
        message:
          "First name, last name, email, password, and role are required",
      });
      return;
    }

    // Validate role
    if (!["user", "recruiter", "admin"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Validate role-specific fields
    if (role === "recruiter" && !companyName) {
      res.status(400).json({
        message: "Company name is required for recruiters",
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({ message: passwordValidation.message });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      companyName: role === "recruiter" ? companyName : undefined,
    });
    await user.save();

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "refresh-secret",
      {
        expiresIn: "7d",
      }
    );

    // Save refresh token
    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
    }).save();

    res.status(201).json({
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
    res.status(500).json({ message: "Server error" });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      res.status(400).json({
        message: "Email, password, and role are required",
      });
      return;
    }

    // Validate role
    if (!["user", "recruiter", "admin"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Validate role matches
    if (user.role !== role) {
      res.status(400).json({ message: "Role does not match" });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "refresh-secret",
      {
        expiresIn: "7d",
      }
    );

    // Save refresh token
    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
    }).save();

    res.status(200).json({
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
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }
    // Verify token exists in database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }
    // Verify token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh-secret"
    ) as { userId: string };
    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }
    // Remove refresh token from database
    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const validateToken: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: "Token is required" });
      return;
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
      role: string;
      firstName: string;
      lastName: string;
    };
    res.status(200).json({
      valid: true,
      userId: decoded.userId,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

// Forgot password - request reset link
export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      res.status(200).json({
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
    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}&email=${email}`;
    // Send email with reset link
    await sendPasswordResetEmail(email, resetLink);
    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link shortly",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password with token
export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      res
        .status(400)
        .json({ message: "Token, email, and new password are required" });
      return;
    }
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      res.status(400).json({ message: passwordValidation.message });
      return;
    }
    // Find the reset token
    const resetRequest = await PasswordReset.findOne({ token, email });
    if (!resetRequest) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
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
    await RefreshToken.deleteMany({ userId: user._id });
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
