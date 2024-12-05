import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Token } from "./token.entity";

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

  @Column()
  authorities!: string;

  @OneToOne(() => Token, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshToken!: Token;
}
