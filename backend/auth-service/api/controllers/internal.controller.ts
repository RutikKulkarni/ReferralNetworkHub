import type { Request, Response } from "express";
import User from "../models/user.model";

/**
 * Update user profile data in auth service
 * This is called by the user service when a user updates their profile
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName } = req.body;

    if (!firstName && !lastName) {
      res
        .status(400)
        .json({ message: "At least one field to update is required" });
      return;
    }

    // Find and update the user
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update only the fields that are provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully in auth service",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Internal update user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
