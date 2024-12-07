import express, { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import { myDataSource } from "./config/database.config";
import { mainRouter } from "./routes/main.routes";
import { errorHandler } from "./middleware/error-handler.middleware";
import { AuthRepository } from "./auth/auth.repository";
import swaggerUi from "swagger-ui-express"; //ui 설정할 수 있는 모듈 불러오기
const swaggerJson = require("../src/swagger/swagger.json");
dotenv.config();

const port = process.env.PORT || 3000;
const app: express.Express = express();
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

// 서버 활성화 확인 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("서버 활성화");
});

// 데이터베이스 초기화 후 미들웨어 설정
myDataSource
  .initialize()
  .then(() => {
    console.log("디비 연결성공");

    // userRepository 주입 미들웨어
    app.use((req: Request, res: Response, next: NextFunction) => {
      req.userRepository = myDataSource.getRepository(AuthRepository);
      next();
    });

    // 메인 라우터 등록
    app.use("/", mainRouter);

    // 글로벌 에러 핸들러는 맨 마지막에 위치
    app.use(errorHandler);

    // 서버 실행
    app.listen(port, () => {
      console.log(`${port} 번에서 서버 실행 중`);
    });
  })
  .catch((err) => {
    console.error("디비 연결실패", err);
  });
