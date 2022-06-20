import * as express from 'express';
import * as userRepository from './repository/user-repository';
import * as bodyParser from 'body-parser';
import { User } from './entity/user';
const app = express();
const port = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/create', async (req, res) => {
    try {
        await userRepository.createUser(User.getFromJson(req.body).encryptPassword());
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