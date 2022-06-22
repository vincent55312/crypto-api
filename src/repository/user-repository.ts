import { AppDataSource } from "../data-source"
import { User } from "../entity/user"

export class UserRepository {
    async createUser(user: User) {
        try {
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
            return false;
        }
    }
}
