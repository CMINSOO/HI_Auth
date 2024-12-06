import { doubleCheckPW } from "../utils/common-auth.util";
import { AuthRepository } from "./auth.repository";
import { SignUpDto } from "./dto/sign-up.dto";
import * as bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  signUp = async (signUpInput: SignUpDto) => {
    const { username, password, confirmPassword, nickname } = signUpInput;

    const existUser = await this.authRepository.getUserByUsername(username);
    //TODO: 글로벌 에러핸들링 constant 만들어서 처리하기 w/ statusCode
    if (existUser) {
      throw new Error("이미 가입된 유저입니다.");
    }

    doubleCheckPW(password, confirmPassword);

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
          authorityName: user.authorityName,
        },
      ],
    };

    return returnValue;
  };
}
