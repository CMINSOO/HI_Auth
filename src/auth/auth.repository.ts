import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

export class AuthRepository {
  constructor(private readonly userRepository: Repository<User>) {}

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
}
