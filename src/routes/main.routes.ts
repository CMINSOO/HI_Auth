import express from "express";
import { authRouter } from "./auth.routes";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);

export { mainRouter };
