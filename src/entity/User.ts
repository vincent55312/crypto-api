import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import * as encryption from '../database/tools/encryption'

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

    encryptPassword(): User {
        this.password = encryption.Crypter.encrypt(this.password);
        return this;
    }

    passwordVerify(password: string) : boolean {
        console.log(password);
        console.log(encryption.Crypter.decrypt(this.password));
        if (password === encryption.Crypter.decrypt(this.password)) {
            return true;
        } else {
            return false;
        }
    }
}
