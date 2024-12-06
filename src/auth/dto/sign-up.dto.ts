import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: "성함 필수 항목입니다." })
  @MinLength(2, { message: "이름은 2글자 이상 입력해주세요" })
  username!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "비밀번호는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
    }
  )
  @IsNotEmpty({ message: "비밀번호 는 필수 항목입니다." })
  password!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "비밀번호는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
    }
  )
  @IsNotEmpty({ message: "비밀번호 확인은 필수 항목입니다." })
  confirmPassword!: string;

  @IsString()
  @IsNotEmpty({ message: " 닉네임 은 필수 항목입니다." })
  @MinLength(2, { message: "닉네임은 2글자 이상 입력해주세요" })
  nickname!: string;
}
