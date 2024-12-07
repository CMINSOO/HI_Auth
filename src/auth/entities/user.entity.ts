import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Token } from "./token.entity";
import { UserType } from "../types/user.type";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column({ type: "enum", enum: UserType, default: UserType.USER })
  authorities!: UserType;

  @OneToOne(() => Token, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshToken!: Token;

  get authorityName(): string {
    return this.authorities === UserType.ADMIN ? "ROLE_ADMIN" : "ROLE_USER";
  }
}
