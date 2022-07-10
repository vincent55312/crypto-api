import * as express from 'express';
import { UserRepository } from './repository/user-repository';
import * as bodyParser from 'body-parser';
import { User } from './entity/user';
import * as dotenv from 'dotenv';
import { Coin } from './entity/coin';
import { CoinRepository } from './repository/coin-repository';

dotenv.config()

const app = express();
const port = process.env['LOCAL_PORT'];

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Post Request is expected to have 
// - email
// - password
app.post('/api/users/create', async (req, res) => {
    try {
        let userInput = User.getFromJson(req.body);
        let userRepository = new UserRepository();
        let user = await userRepository.create(userInput);
        res.status(200).send(user);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

// Get Request is expected to have 
// - email
// - password
app.get('/api/users/can-login', async (req, res) => {
    try {
        let userInput = User.getFromJson(req.body);
        let userRepository = new UserRepository();
        let user = await userRepository.canLogin(userInput);
        res.status(200).send(user);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
});

// Post Request is expected to have 
// - userId
// - name
// - balance
app.post('/api/coins/create', async (req, res) => {
    try {
        let coinInput = Coin.getFromJson(req.body);
        let coinRepository = new CoinRepository();
        let coinCreated = await coinRepository.create(coinInput);
        res.status(200).send(coinCreated);
    } catch(error) {
        res.status(500).send(error.message);
    }
});


app.listen(port);