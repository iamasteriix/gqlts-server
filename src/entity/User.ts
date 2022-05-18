import { Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User extends BaseEntity {
    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }

    @PrimaryColumn('uuid')
    id: string

    @Column('varchar', { length: 255 })
    email: string

    @Column('text')
    password: string
}
