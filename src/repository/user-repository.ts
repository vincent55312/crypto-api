import { AppDataSource } from "../data-source"
import { Crypter } from "../database/tools/encryption";
import { User } from "../entity/user"
import { ErrorType } from "../utils/error-enum";

export class UserRepository {
    async create(userInput: User) {
        try {
            if (!userInput.isValid()) {
                throw new Error(ErrorType.INVALID_ENTITY);
            }

            if (await this.emailAlreadyExist(userInput.email)) {
                throw new Error(ErrorType.EMAIL_ALREADY_EXIST);
            }

            await AppDataSource.initialize();
            let userSaved = await AppDataSource.manager.save(userInput.encryptPassword());
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

    async update(userInput: User) {
        try {
            if (!userInput.isValid()) {
                throw new Error(ErrorType.INVALID_ENTITY);
            }
    
            await AppDataSource.initialize();
            let user = await AppDataSource.manager.save(User, userInput);
    
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }        
            return user;
        } catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }
    
    async emailAlreadyExist(emailUser: string) {
        try {
            await AppDataSource.initialize();
            let numberUsers = (await AppDataSource.manager.findBy(User, {email: emailUser})).length;
            
            await AppDataSource.destroy();
            if (numberUsers > 0) {
                return true;
            } 
            return false;
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }

    async canLogin(userInput: User) {
        try {
            if (!userInput.isValid()) {
                throw new Error(ErrorType.INVALID_ENTITY);
            }

            if (await this.emailAlreadyExist(userInput.email) === false) {
                throw new Error(ErrorType.WRONG_EMAIL);
            }
            await AppDataSource.initialize();
            let userToVerify = await AppDataSource.manager.findOneBy(User, {email: userInput.email});

            if (Crypter.encrypt(userInput.password) === userToVerify.password) {
                if (AppDataSource.isInitialized) {
                    await AppDataSource.destroy();
                }

                return userToVerify;
            } else {
                throw new Error(ErrorType.WRONG_PASSWORD);
            }
        }
        catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }

    async canInteract(token: string) {
        try {
            if (token === undefined) {
                throw new Error(ErrorType.AUTHENTIFICATION_FAILED);
            }

            await AppDataSource.initialize();
            let user = await AppDataSource.manager.findBy(User, [{token: token}]);
            await AppDataSource.destroy();

            if (user.length === 1) {
                return user[0].id;
            } 

            throw new Error(ErrorType.AUTHENTIFICATION_FAILED);
        } catch (error) {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            throw error;
        }
    }
}
