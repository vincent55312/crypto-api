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

    async update(coin: Coin) {
        try {
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

    async delete(user: User, coin: Coin) {
        try {
            if (await this.coinNameAlreadyExistForUser(user, coin.name) === false) {
                throw new Error(ErrorType.COIN_NOT_FOUND);
            }
            await AppDataSource.initialize();
            await AppDataSource.manager.delete(Coin, {id: coin.id});
            await AppDataSource.destroy();
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }

    async getAllForUser(user: User) {
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
        let coinsUser = await this.getAllForUser(user);
        coinsUser.forEach(element => {
            if (element.name.toUpperCase() === coinName.toUpperCase()) {
                coinNameAlreadyExist = true;
            }
        });

        return coinNameAlreadyExist;
    }

    async getFromId(coinId: number, userId: number) {
        try {
            if (coinId === undefined) {
                throw new Error(ErrorType.INVALID_ENTITY);
            }

            await AppDataSource.initialize();
            let coin: Coin = await AppDataSource.manager.findOneBy(Coin, [{id: coinId, user: {id: userId} }]);
            await AppDataSource.destroy();
            
            if (coin === null) {
                throw new Error(ErrorType.COIN_NOT_FOUND);
            }
            return coin;
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }
}
