import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("tokens")
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  refreshToken!: string;

  @Column()
  expireAt!: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  user!: User;
}
