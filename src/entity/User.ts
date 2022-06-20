import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pseudo: string

    @Column()
    email: string

    @Column()
    password: string

    static getFromJson(jsonUser): User {
        let user = new User;
        user.email = jsonUser.email;
        user.pseudo = jsonUser.pseudo;
        user.password = jsonUser.password;
        return user;
    }
}
