import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import * as encryption from '../database/tools/encryption'

@Entity()
export class User {

    constructor(id?: number, email?: string, password?: string) {
        this.id = id || undefined;
        this.email = email || undefined;
        this.password = password || undefined;
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    static getFromJson(jsonUser: any): User {
        return new User(jsonUser.id, jsonUser.email, jsonUser.password);
    }

    encryptPassword(): User {
        this.password = encryption.Crypter.encrypt(this.password);
        return this;
    }

    passwordVerify(password: string) : boolean {
        if (password === encryption.Crypter.decrypt(this.password)) {
            return true;
        } 
        
        return false;
    }

    isValid(): boolean {
        if (this.email === undefined || this.password === undefined) {
            return false;
        }

        if (this.email.length < 5 || this.password.length < 5) {
            return false;
        }

        return true;
    }
}
