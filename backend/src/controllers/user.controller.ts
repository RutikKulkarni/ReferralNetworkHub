import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import httpStatus from "http-status";
import { userService } from "../services";

/**
 * Get user details by user ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} The response with user details.
 */
const getUserDetails = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (userId !== req.user.sub) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: "User not authorized to access this resource" });
  }

  const user = await userService.getDetailsById(userId);
  return res
    .status(httpStatus.OK)
    .send({ message: "User's details fetched successfully", userInfo: user });
});

/**
 * Post user details for a specific user.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} The response with a success message and user info.
 */
const postUserDetails = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const details = req.body;

  if (userId !== req.user.sub) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: "User not authorized to access this resource" });
  }

  const user = await userService.postDetails(userId, details);
  return res
    .status(httpStatus.OK)
    .send({ message: "Details added successfully", userInfo: user });
});

export { getUserDetails, postUserDetails };
