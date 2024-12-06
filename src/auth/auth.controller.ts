import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { validateOrReject } from "class-validator";
import { plainToClass } from "class-transformer";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signUp = async (req: Request, res: Response, next: Function) => {
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
}
