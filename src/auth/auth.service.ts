import { REFRESH_TOKEN_EXPIRE } from "../constants/token.constant";
import { doubleCheckPW } from "../utils/common-auth.util";
import { calculateExpireAt, createToken } from "../utils/create-token.util";
import { AuthRepository } from "./auth.repository";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import * as bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  signUp = async (signUpInput: SignUpDto) => {
    const { username, password, confirmPassword, nickname } = signUpInput;

    doubleCheckPW(password, confirmPassword);

    const existUser = await this.authRepository.getUserByUsername(username);
    //TODO: 글로벌 에러핸들링 constant 만들어서 처리하기 w/ statusCode
    if (existUser) {
      throw new Error("이미 가입된 유저입니다.");
    }

    //TODO: SaltRound 상수값으로 빼주기
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.authRepository.createUser(
      username,
      hashedPassword,
      nickname
    );

    const returnValue = {
      username: user.username,
      nickname: user.nickname,
      authorities: [
        {
          authorityName: user.authorityName || "ROLE_USER",
        },
      ],
    };

    return returnValue;
  };

  signIn = async (signInInput: SignInDto) => {
    const { username, password } = signInInput;

    const user = await this.authRepository.getUserByUsername(username);
    //TODO: 에러처리 상수화
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다.");
    }

    const comparePW = await this.authRepository.comparePW(user.id, password);
    //TODO: 에러처리
    if (!comparePW) {
      throw new Error("비밀번호를 확인해주세요");
    }

    const token = createToken(user.id);
    if (!token) {
      throw new Error("토큰발급중 에러가 발생했습니다");
    }

    const expireAt = calculateExpireAt(REFRESH_TOKEN_EXPIRE as string);
    await this.authRepository.saveToken(token.refreshToken, user.id, expireAt);

    const returnValue = {
      token: token.accessToken,
    };
    return returnValue;
  };
}
