import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/create-token.util";
import { myDataSource } from "../config/database.config";
import { User } from "../auth/entities/user.entity";

export const accessTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "JWT TOKEN 이 없습니다" });
    }

    const [tokenType, accessToken] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      return res.status(401).json({ message: "토큰 타입이 일치하지 않습니다" });
    }
    if (!accessToken) {
      return res.status(401).json({ message: "토큰이 존재하지 않습니다" });
    }

    // 토큰 검증 및 Payload 확인
    let payload: any;
    try {
      payload = validateToken(accessToken);
    } catch (err) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다" });
    }

    // 사용자 조회
    const userRepository = myDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: payload.id } });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });
    }

    // 사용자 정보를 요청 객체에 추가
    (req as any).user = user;

    next(); // 다음 미들웨어로 전달
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생했습니다" });
  }
};
