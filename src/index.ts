import * as express from 'express';
import { UserRepository } from './repository/user-repository';
import * as bodyParser from 'body-parser';
import { User } from './entity/user';
import * as dotenv from 'dotenv';
import { Coin } from './entity/coin';
import { CoinRepository } from './repository/coin-repository';
import { CoinGeckoRepository } from './repository/coingecko-repository';

dotenv.config()

const app = express();
const port = process.env['LOCAL_PORT'];

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Post Request is expected to have 
// - email
// - password
app.post('/api/user/register', async (req, res) => {
    try {
        let userInput = User.getFromJson(req.body);
        let userRepository = new UserRepository();
        let user = await userRepository.create(userInput);
        user.assignAuthToken();
        userRepository.update(user);

        res.status(200).send(user);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

// Get Request is expected to have 
// - email
// - password
app.post('/api/user/login', async (req, res) => {
    try {
        let userInput = User.getFromJson(req.body);
        let userRepository = new UserRepository();
        let user = await userRepository.canLogin(userInput);
        user.assignAuthToken();
        userRepository.update(user);

        res.status(200).send(user);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
});

// Post Request is expected to have 
// - header : token
// - body : name
// - body : balance
app.post('/api/user/coins/create', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        let coinInput = Coin.getFromJson(req.body);
        
        let coinRepository = new CoinRepository();
        let userRepository = new UserRepository();
        const userId = await userRepository.canInteract(token);

        coinInput.user.id = userId;
        let coinCreated = await coinRepository.create(coinInput);

        res.status(200).send(coinCreated);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

// Post Request is expected to have 
// - body : coinId
// - body : balance
// - header : token
app.put('/api/user/coins/update', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        const balance = req.body.balance;
        const coinId = req.body.coinId;

        let coinRepository = new CoinRepository();
        let userRepository = new UserRepository();

        const userId = await userRepository.canInteract(token);

        let coin = await coinRepository.getFromId(coinId, userId);
        coin.balance = balance;
        await coinRepository.update(coin);
        
        res.status(200).send(coin);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

// Post Request is expected to have 
// - header : token
// - body : coinId
app.delete('/api/user/coins/delete', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        const coinId = req.body.coinId;
        let coinRepository = new CoinRepository();
        let userRepository = new UserRepository();

        const userId = await userRepository.canInteract(token);

        let coin = await coinRepository.getFromId(coinId, userId);
        await coinRepository.delete(new User(userId), coin);

        res.sendStatus(200); 
    } catch(error) {
        res.status(500).send(error.message);
    }
});


// Get Request is expected to have 
// - header : x-auth-token
// - body : coinId
app.get('/api/user/coins/get', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        const coinId = req.body.coinId;

        let coinRepository = new CoinRepository();
        let userRepository = new UserRepository();
        let coinGeckoRepository = new CoinGeckoRepository();

        const userId = await userRepository.canInteract(token);

        let coin = await coinRepository.getFromId(coinId, userId);
        const marketData = await coinGeckoRepository.getFromName(coin.name);
        coin.hydrateMarketData(marketData);
        
        res.status(200).send(coin);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

// Get Request is expected to have 
// - header : token
app.get('/api/user/portfolio/get', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        let coinRepository = new CoinRepository();
        let userRepository = new UserRepository();
        let coinGeckoRepository = new CoinGeckoRepository();
        
        const userId = await userRepository.canInteract(token);
        let coins = await coinRepository.getAllForUser(new User(userId));

        let balance = 0;
        for await (let coin of coins) {
            const marketData = await coinGeckoRepository.getFromName(coin.name);
            coin.hydrateMarketData(marketData);
            if (coin.market_data.length) {
                balance += coin.balance * coin.market_data[0].current_price;
            }
        }

        res.status(200).send([{'total_balance' : balance}, coins]);
    } catch(error) {
        res.status(500).send(error.message);
    }
});


// Get Request is expected to have 
// - header : token
app.get('/api/markets', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        let coinGeckoRepository = new CoinGeckoRepository();
        let userRepository = new UserRepository();

        await userRepository.canInteract(token);

        let coins = await coinGeckoRepository.getAll();
        res.status(200).send(coins);
    } catch(error) {
        res.status(500).send(error.message);
    }
});


app.listen(port);