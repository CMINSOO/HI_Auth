import express from "express";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "../auth/auth.service";
import { AuthRepository } from "../auth/auth.repository";
import { myDataSource } from "../config/database.config";
import { User } from "../auth/entities/user.entity";
import { asyncHandler } from "../utils/router-error-handler.util";
import { Token } from "../auth/entities/token.entity";

const authRouter = express.Router();
const userRepository = myDataSource.getRepository(User);
const tokenRepository = myDataSource.getRepository(Token);
const authRepository = new AuthRepository(userRepository, tokenRepository);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post("/signup", asyncHandler(authController.signUp));
authRouter.post("/signin", asyncHandler(authController.signIn));

export { authRouter };
