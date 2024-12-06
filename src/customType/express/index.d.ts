import { Repository } from "typeorm";
import { AuthRepository } from "./auth/auth.repository";

declare global {
  namespace Express {
    interface Request {
      userRepository?: Repository<AuthRepository>;
    }
  }
}
