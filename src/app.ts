import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { myDataSource } from "./config/database.config";
import { mainRouter } from "./routes/main.routes";
import { errorHandler } from "./middleware/error-handler.middleware";

dotenv.config();

const port = process.env.PORT;
const app: express.Express = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("서버 활성화");
});

app.use("/", mainRouter);

app.use(errorHandler);

myDataSource
  .initialize()
  .then(() => {
    console.log("디비 연결성공");

    app.listen(port, () => {
      console.log(`${port} 번에서 서버실행중`);
    });
  })
  .catch((err) => {
    console.error("디비 연결실패", err);
  });
