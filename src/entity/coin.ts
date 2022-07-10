import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./user";

@Entity()
export class Coin {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.id)
    user : User;

    @Column()
    name: string

    @Column({ type: "float" }) 
    balance: number

    static getFromJson(jsonCoin: any): Coin {
        let coin = new Coin;
        let user = new User(jsonCoin.userId);

        coin.user = user;
        coin.name = jsonCoin.name;
        coin.balance = jsonCoin.balance;
        return coin;
    }

    isValid() {
        if (this.user.id === undefined || this.name === undefined || this.balance === undefined) {
            return false;
        }
        return true;
    }
}
