import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { validateOrReject } from "class-validator";
import { plainToClass } from "class-transformer";
import { SignInDto } from "./dto/sign-in.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signUpInput = plainToClass(SignUpDto, req.body);
      await validateOrReject(signUpInput);

      const user = await this.authService.signUp(signUpInput);

      return res.status(201).json({
        status: 201,
        message: "회원가입에 성공하였습니다",
        user,
      });
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInInput = plainToClass(SignInDto, req.body);
      await validateOrReject(signInInput);

      const user = await this.authService.signIn(signInInput);

      return res.status(200).json({
        status: 200,
        message: "로그인에 성공하였습니다",
        user,
      });
    } catch (err) {
      next(err);
    }
  };
}
