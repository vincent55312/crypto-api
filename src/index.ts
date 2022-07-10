import * as express from 'express';
import { UserRepository } from './repository/user-repository';
import * as bodyParser from 'body-parser';
import { User } from './entity/user';
import * as dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env['LOCAL_PORT'];

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Request is expected to have 
// - email
// - pseudo
// - password
app.post('/api/create', async (req, res) => {
    try {
        let user = User.getFromJson(req.body);
        user.encryptPassword();
        let userRepository = new UserRepository();
        await userRepository.createUser(user);
        res.status(200).send(user.email + ' successfully created');
    } catch(error) {
        res.status(500).send(error.stack);
    }
});

// Request is expected to have 
// - email
// - password
app.get('/api/can-login', async (req, res) => {
    try {
        let user = User.getFromJson(req.body);
        let userRepository = new UserRepository();
        let canLogin = await userRepository.userCanLogin(user);
        res.status(200).send(canLogin);
    }
    catch(error) {
        res.status(500).send(error.stack);
    }
})

app.listen(port);