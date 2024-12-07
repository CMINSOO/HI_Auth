import { validateOrReject } from "class-validator";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { NextFunction, Request, Response } from "express";
import { SignUpDto } from "../dto/sign-up.dto";
import { SignInDto } from "../dto/sign-in.dto";

// class-validator 모킹
jest.mock("class-validator", () => ({
  ...jest.requireActual("class-validator"),
  validateOrReject: jest.fn(),
}));

describe("AuthController", () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    // AuthService Mock 생성
    authService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    // AuthController 초기화
    authController = new AuthController(authService);

    // req, res, next Mock 생성
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // 모든 Mock 초기화
  });

  describe("signUp", () => {
    it("201 상태 코드와 성공 메시지를 반환한다", async () => {
      const mockUser = {
        username: "조민수",
        nickname: "테스트!",
        authorities: [{ authorityName: "ROLE_USER" }],
      };

      // 요청 데이터
      req.body = {
        username: "조민수",
        password: "Test1234!",
        passwordConfirm: "Test1234!",
        nickname: "테스트!",
      };

      // Mock 동작 설정
      (validateOrReject as jest.Mock).mockResolvedValueOnce(undefined);
      authService.signUp.mockResolvedValueOnce(mockUser);

      // 컨트롤러 호출
      await authController.signUp(req as Request, res as Response, next);

      // 호출 확인
      expect(validateOrReject).toHaveBeenCalledWith(expect.any(SignUpDto));
      expect(authService.signUp).toHaveBeenCalledWith(expect.any(SignUpDto));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: "회원가입에 성공하였습니다",
        user: mockUser,
      });
    });

    it("유효성 검증 실패 시 next가 호출된다", async () => {
      const validationError = new Error("Validation Error");
      (validateOrReject as jest.Mock).mockRejectedValueOnce(validationError);

      await authController.signUp(req as Request, res as Response, next);

      expect(validateOrReject).toHaveBeenCalledWith(expect.any(SignUpDto));
      expect(authService.signUp).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(validationError);
    });
  });

  describe("signIn", () => {
    it("로그인 성공메세지 와 200 상태 코드를 반환", async () => {
      // 결과 반환을 위한 가짜 토큰
      const mockToken = { token: "fakeToKeString" };
      //바디 요청 뫀데이터
      req.body = { username: "조민수", password: "Test1234!" };

      // Input value
      (validateOrReject as jest.Mock).mockResolvedValueOnce(undefined);
      // 리턴값 정의
      authService.signIn.mockResolvedValueOnce(mockToken);

      // 컨트롤러 호출
      await authController.signIn(req as Request, res as Response, next);

      // 호출 확인
      expect(validateOrReject).toHaveBeenCalledWith(expect.any(SignInDto));
      expect(authService.signIn).toHaveBeenCalledWith(expect.any(SignInDto));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "로그인에 성공하였습니다",
        user: mockToken,
      });
    });

    it("유효성 검증 실패 시 next가 호출된다", async () => {
      const validationError = new Error("Validation Error");
      (validateOrReject as jest.Mock).mockRejectedValueOnce(validationError);

      await authController.signIn(req as Request, res as Response, next);

      expect(validateOrReject).toHaveBeenCalledWith(expect.any(SignInDto));
      expect(authService.signIn).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(validationError);
    });
  });
});
