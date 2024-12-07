import { AuthService } from "../auth.service";
import { AuthRepository } from "../auth.repository";
import { SignUpDto } from "../dto/sign-up.dto";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { calculateExpireAt, createToken } from "../../utils/create-token.util";

jest.mock("bcrypt");
jest.mock("../../utils/create-token.util", () => ({
  createToken: jest.fn(),
  calculateExpireAt: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    // AuthRepository Mock 생성
    authRepository = {
      getUserByUsername: jest.fn(),
      createUser: jest.fn(),
      comparePW: jest.fn(),
      saveToken: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    // AuthService 초기화
    authService = new AuthService(authRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Mock 데이터 초기화
  });

  describe("signUp", () => {
    it("이미 가입된 유저가 있을 경우 에러를 반환한다", async () => {
      const signUpData: SignUpDto = {
        username: "testUser",
        password: "Test@1234",
        confirmPassword: "Test@1234",
        nickname: "testNick",
      };

      const existingUser = {
        id: 1,
        username: "testUser",
        nickname: "existingNick",
      };

      authRepository.getUserByUsername.mockResolvedValueOnce(
        existingUser as any
      );

      await expect(authService.signUp(signUpData)).rejects.toEqual(
        new Error("이미 가입된 유저입니다.")
      );

      expect(authRepository.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    it("비밀번호와 확인 비밀번호가 일치하지 않을 경우 에러를 반환한다", async () => {
      const signUpData: SignUpDto = {
        username: "testUser",
        password: "Test@1234",
        confirmPassword: "DifferentPassword",
        nickname: "testNick",
      };

      await expect(authService.signUp(signUpData)).rejects.toEqual(
        new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.") // doubleCheckPW에서 발생하는 에러
      );

      expect(authRepository.getUserByUsername).not.toHaveBeenCalled();
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    it("유저를 성공적으로 생성하고 반환한다", async () => {
      const signUpData: SignUpDto = {
        username: "testUser",
        password: "Test@1234",
        confirmPassword: "Test@1234",
        nickname: "testNick",
      };

      const hashedPassword = "hashedPassword";
      const createdUser = {
        id: 1,
        username: "testUser",
        password: hashedPassword,
        nickname: "testNick",
        authorityName: "ROLE_USER",
      };

      const expectedReturnValue = {
        username: "testUser",
        nickname: "testNick",
        authorities: [{ authorityName: "ROLE_USER" }],
      };

      jest.spyOn(bcrypt, "hashSync").mockReturnValueOnce(hashedPassword); // bcrypt Mock 설정
      authRepository.getUserByUsername.mockResolvedValueOnce(null); // 유저가 존재하지 않는 경우
      authRepository.createUser.mockResolvedValueOnce(createdUser as User); // 새 유저 생성 Mock

      const result = await authService.signUp(signUpData);

      expect(authRepository.getUserByUsername).toHaveBeenCalledWith("testUser");
      expect(authRepository.createUser).toHaveBeenCalledWith(
        "testUser",
        hashedPassword,
        "testNick"
      );
      expect(result).toEqual(expectedReturnValue);
    });
  });

  describe("signIn", () => {
    it("유저정보를 찾응수없을때, 오류 반환", async () => {
      const signInInput = { username: "없는유저", password: "Test1234!" };

      authRepository.getUserByUsername.mockResolvedValueOnce(null);

      await expect(authService.signIn(signInInput)).rejects.toEqual(
        new Error("존재하지 않는 사용자입니다.")
      );
    });
    it("비밀번가 동일하지 않을때, 오류 반환", async () => {
      const signInInput = { username: "테스트유저", password: "Test1234!" };
      const mockUser = {
        username: "테스트유저",
        password: "hashedPassword",
        nickname: "김치",
      };

      authRepository.getUserByUsername.mockResolvedValueOnce(mockUser as User);
      authRepository.comparePW.mockResolvedValueOnce(false);
      await expect(authService.signIn(signInInput)).rejects.toEqual(
        new Error("비밀번호를 확인해주세요")
      );
      expect(authRepository.saveToken).not.toHaveBeenCalled();
    });

    it("로그인 성공시, 토큰 발급", async () => {
      const signInInput = { username: "테스트유저", password: "Test1234!" };
      const mockUser = {
        id: 1,
        username: "테스트유저",
        password: "hashedPassword",
        nickname: "김치",
      };
      const mockToken = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };
      const mockExpireAt = "2024-12-08";

      // Mock 설정
      authRepository.getUserByUsername.mockResolvedValueOnce(mockUser as User);
      authRepository.comparePW.mockResolvedValueOnce(true); // Mock 비교 결과 설정
      authRepository.saveToken.mockResolvedValueOnce();

      (createToken as jest.Mock).mockReturnValueOnce(mockToken);
      (calculateExpireAt as jest.Mock).mockReturnValueOnce(mockExpireAt);

      const result = await authService.signIn(signInInput);

      expect(authRepository.getUserByUsername).toHaveBeenCalledWith(
        "테스트유저"
      );
      expect(authRepository.comparePW).toHaveBeenCalledWith(
        mockUser.id,
        signInInput.password
      );
      expect(authRepository.saveToken).toHaveBeenCalledWith(
        mockToken.refreshToken,
        mockUser.id,
        mockExpireAt
      );
      expect(result).toEqual({ token: mockToken.accessToken });
    });
  });
});
