import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../auth/entities/user.entity";
import { Token } from "../auth/entities/token.entity";

dotenv.config();

export const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Token],
});
