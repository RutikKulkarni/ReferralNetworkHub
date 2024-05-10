import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import { authService, tokenService } from "../services";

/**
 * Register a new user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves with the response object.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const user = await authService.registerUser(userData);
  return res
    .status(httpStatus.CREATED)
    .send({ message: "User created successfully", user });
});

/**
 * Login a user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves with the response object.
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  const token = await tokenService.generateAuthToken(user);
  return res
    .status(httpStatus.OK)
    .send({ message: "User logged in successfully", user, token });
});

export { register, login };
