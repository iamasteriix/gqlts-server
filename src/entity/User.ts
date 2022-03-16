import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, BaseEntity} from "typeorm";
import {v4 as uuidv4} from "uuid";

@Entity()
export class User extends BaseEntity {
    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }

    @PrimaryColumn("uuid") id: string;

    @Column("varchar", {length: 255}) email: string;

    @Column("text") password: string;

    @Column() age: number;

}
