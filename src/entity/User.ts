import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import * as encryption from '../database/tools/encryption'
import * as crypto from 'crypto';

@Entity()
export class User {

    constructor(id?: number, email?: string, password?: string) {
        this.id = id || undefined;
        this.email = email || undefined;
        this.password = password || undefined;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    token: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

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

        if (this.email.length < 4 || this.password.length < 4) {
            return false;
        }

        return true;
    }

    assignAuthToken(): void {
        if (this.email !== undefined) {
            let baseToEncode : string = this.id.toString() + Date.now().toString() + this.email;
            let hash = crypto.createHash('sha256').update(baseToEncode).digest('hex');
            this.token = hash;
        }
    }
}
