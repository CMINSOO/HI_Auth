import * as jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../constants/token.constant";

export function createToken(userId: number) {
  const payload = { id: userId };

  const accessToken = jwt.sign({ payload }, ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
  const refreshToken = jwt.sign({ payload }, REFRESH_TOKEN_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  return { accessToken, refreshToken };
}

export function calculateExpireAt(expireIn: string): string {
  const currentTime = new Date();
  const expireDurationMs = parseDurationToMs(expireIn);
  const expireAt = new Date(currentTime.getTime() + expireDurationMs);

  return expireAt.toISOString();
}

// "7d"와 같은 포맷을 밀리초로 변환
function parseDurationToMs(duration: string): number {
  const unit = duration.slice(-1); // 단위 추출 ("s", "m", "h", "d")
  const value = parseInt(duration.slice(0, -1), 10); // 숫자 부분 추출

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid duration format");
  }
}

export function validateToken(accessToken: string) {
  return jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string);
}
