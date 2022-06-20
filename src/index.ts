import * as express from 'express';
import * as userRepository from './repository/user-repository';
import * as bodyParser from 'body-parser';
import { User } from './entity/user';
import * as dotenv from 'dotenv';
dotenv.config()

const app = express();
const port = process.env['LOCAL_PORT'];

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/create', async (req, res) => {
    try {
        let user = User.getFromJson(req.body);
        user.encryptPassword();
        await userRepository.createUser(user);
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(404);
    }
});

app.post('api/can-login', async (req, res) => {
    try {
        res.sendStatus(200);
    }
    catch(error) {
        res.sendStatus(404);
    }
})

app.listen(port);