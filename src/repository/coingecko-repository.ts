import axios from 'axios';
import * as dotenv from 'dotenv';
import { ErrorType } from '../utils/error-enum';
dotenv.config()

export class CoinGeckoRepository {
    async getAll() {
        try {
            const urlGetAllCoins = process.env['COINGECKCO_BASE_API_URL'] + '/coins/markets?vs_currency=usd';
            let res = await axios.get(urlGetAllCoins);

            return res.data;
        }
        catch(error) {
            throw new Error(ErrorType.COINGECKO_API_ERROR)
        }
    };

    async getFromName(name: string) {
        try {
            const urlGetCoinById = process.env['COINGECKCO_BASE_API_URL'] + '/coins/markets?vs_currency=usd&ids=' + name;
            let res = await axios.get(urlGetCoinById);

            return res.data;
        }
        catch(error) {
            throw new Error(ErrorType.COINGECKO_API_ERROR)
        }
    }
}