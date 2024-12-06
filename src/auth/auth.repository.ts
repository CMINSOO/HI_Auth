import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { Token } from "./entities/token.entity";
import { createToken } from "../utils/create-token.util";

export class AuthRepository {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly tokenRepository: Repository<Token>
  ) {}

  getUserByUsername = async (username: string) => {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  };

  createUser = async (
    username: string,
    hashedPassword: string,
    nickname: string
  ) => {
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      nickname,
    });

    return await this.userRepository.save(newUser);
  };

  comparePW = async (userId: number, password: string) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const isValid = bcrypt.compareSync(password, user?.password as string);

    return isValid;
  };

  saveToken = async (token: string, userId: number, expireAt: string) => {
    const existUser = await this.tokenRepository.findOne({
      where: { userId },
    });

    if (existUser) {
      existUser.refreshToken = token;
      existUser.expireAt = expireAt;
      console.log("여기서 걸려야한다");
      await this.tokenRepository.save(existUser);
    } else {
      const data = this.tokenRepository.create({
        refreshToken: token,
        userId,
        expireAt,
      });
      await this.tokenRepository.save(data);
    }
  };

  // 혹시 나중에 쓸걸 대비해서 미리 만들어놓기
  // 시간남으면 컨트롤러 서비스 레이어 추가하기
  publishNewToken = async (userId: number) => {
    const token = await this.tokenRepository.findOne({
      where: { userId },
    });

    const now = new Date();
    const expireAt = new Date(token!.expireAt);
    if (expireAt > now) {
      const accessToken = createToken(token?.userId as number);
      return accessToken;
    } else {
      throw new Error("RefreshToken이 만료되었습니다");
    }
  };
}
