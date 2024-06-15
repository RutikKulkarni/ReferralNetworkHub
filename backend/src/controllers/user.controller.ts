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

  let user = await userService.getUserDetailsById(userId);
  return res.status(httpStatus.OK).send(user);
});

export { getUserDetails };
