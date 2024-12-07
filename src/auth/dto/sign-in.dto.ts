import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty({ message: "성함 필수 항목입니다." })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: "비밀번호 는 필수 항목입니다." })
  password!: string;
}
