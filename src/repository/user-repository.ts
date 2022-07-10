import { AppDataSource } from "../data-source"
import { Crypter } from "../database/tools/encryption";
import { User } from "../entity/user"

export class UserRepository {
    async createUser(user: User) {
        try {
            if (user.email == undefined || user.password == undefined || user.pseudo == undefined) {
                throw new Error('Incorrect request');
            }
            
            if (await this.emailAlreadyExist(user.email)) {
                throw new Error('Email : '+ user.email + ' already exist');
            }

            await AppDataSource.initialize();
            let userSaved = await AppDataSource.manager.save(user);
            await AppDataSource.destroy();
            return userSaved;
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }
    
    async getAllUsers() {
        try {
            await AppDataSource.initialize();
            let users = await AppDataSource.manager.find(User);
            await AppDataSource.destroy();
            return users;
        }
        catch(error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }
    
    async emailAlreadyExist(emailUser: string) {
        try {
            await AppDataSource.initialize();
            let numberUsers = (await AppDataSource.manager.findBy(User, {email: emailUser})).length
            await AppDataSource.destroy();
            if (numberUsers > 0) {
                return true;
            } else {
                return false;
            }
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }

    async userCanLogin(userInput: User) {
        let userCanLogin = false;
        try {
            if (userInput.email == undefined || userInput.password == undefined) {
                throw new Error('Incorrect request');
            }

            if (await this.emailAlreadyExist(userInput.email) == false) {
                throw new Error('Email is not existing');
            }
            await AppDataSource.initialize();
            let userToVerify = await AppDataSource.manager.findOneBy(User, {email: userInput.email});

            if (Crypter.encrypt(userInput.password) === userToVerify.password) {
                userCanLogin = true;
            }

            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            return userCanLogin;
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }
}
