import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// Joi 스키마 정의
const timeFormatRegex = /^[0-9]+[smhd]$/; // 숫자 + s/m/h/d 형식

const envSchema = Joi.object({
  ACCESS_TOKEN_SECRET: Joi.string().required().messages({
    "any.required": "ACCESS_TOKEN_SECRET가 설정되어 있지 않습니다.",
    "string.empty": "ACCESS_TOKEN_SECRET는 비어 있을 수 없습니다.",
  }),
  ACCESS_TOKEN_EXPIRE: Joi.string()
    .required()
    .pattern(timeFormatRegex)
    .messages({
      "any.required": "ACCESS_TOKEN_EXPIRE가 설정되어 있지 않습니다.",
      "string.empty": "ACCESS_TOKEN_EXPIRE는 비어 있을 수 없습니다.",
      "string.pattern.base":
        "ACCESS_TOKEN_EXPIRE는 숫자 뒤에 s, m, h, d 중 하나가 와야 합니다. 예: 3600s, 60m, 1h, 7d",
    }),
  REFRESH_TOKEN_SECRET: Joi.string().required().messages({
    "any.required": "REFRESH_TOKEN_SECRET가 설정되어 있지 않습니다.",
    "string.empty": "REFRESH_TOKEN_SECRET는 비어 있을 수 없습니다.",
  }),
  REFRESH_TOKEN_EXPIRE: Joi.string()
    .required()
    .pattern(timeFormatRegex)
    .messages({
      "any.required": "REFRESH_TOKEN_EXPIRE가 설정되어 있지 않습니다.",
      "string.empty": "REFRESH_TOKEN_EXPIRE는 비어 있을 수 없습니다.",
      "string.pattern.base":
        "REFRESH_TOKEN_EXPIRE는 숫자 뒤에 s, m, h, d 중 하나가 와야 합니다. 예: 7d, 1h, 30m, 10s",
    }),
}).unknown(); // .unknown()은 스키마에 정의되지 않은 환경 변수도 허용

// 유효성 검사
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`환경 변수 유효성 검사 실패: ${error.message}`);
}

// 검증된 환경 변수 사용
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
} = envVars;

const HASH_ROUND = process.env.HASH_ROUND;

export {
  HASH_ROUND,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
};
