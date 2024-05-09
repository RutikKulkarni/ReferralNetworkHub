import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import { authService } from "../services";

/**
 * Register a new user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves with the response object.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  let userData = req.body;
  let user = await authService.registerUser(userData);
  return res
    .status(httpStatus.CREATED)
    .send({ message: "User created successfully", user });
});

export { register };
