import { AppDataSource } from "../data-source"
import { Coin } from "../entity/coin"
import { User } from "../entity/user"
import { ErrorType } from "../utils/error-enum";

export class CoinRepository {
    async create(coin: Coin) {
        try {
            if (!coin.isValid()) {
                throw new Error(ErrorType.INVALID_ENTITY);
            }
            
            if (await this.coinNameAlreadyExistForUser(coin.user, coin.name)) {
                throw new Error(ErrorType.COIN_ALREADY_EXIST);
            }

            await AppDataSource.initialize();
            let coinSaved = await AppDataSource.manager.save(coin);
            await AppDataSource.destroy();
            return coinSaved;
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }

    async getForUser(user: User) {
        try {
            await AppDataSource.initialize();
            let coinsForUser: Array<Coin> = (await AppDataSource.manager.findBy(Coin, {user: {id: user.id}}));
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            return coinsForUser;
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }

    async coinNameAlreadyExistForUser(user: User, coinName: string) {
        let coinNameAlreadyExist: boolean = false;
        let coinsUser = await this.getForUser(user);
        coinsUser.forEach(element => {
            if (element.name.toUpperCase() === coinName.toUpperCase()) {
                coinNameAlreadyExist = true;
            }
        });
        return coinNameAlreadyExist;
    }
}
