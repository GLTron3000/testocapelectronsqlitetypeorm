import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
export class User {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
