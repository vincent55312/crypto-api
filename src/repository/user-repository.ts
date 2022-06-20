import { AppDataSource } from "../data-source"
import { User } from "../entity/user"

export async function createUser(user: User) {
    try {
        if (await emailAlreadyExist(user.email)) {
            throw new Error('Email : '+ user.email + ' already exist');
        }
        await AppDataSource.initialize();
        let userSaved = await AppDataSource.manager.save(user);
        await AppDataSource.destroy();
        return userSaved;
    }
    catch (error) {
        throw error;
    }
}

export async function getAllUsers() {
    try {
        await AppDataSource.initialize();
        let users = await AppDataSource.manager.find(User);
        await AppDataSource.destroy();
        return users;
    }
    catch(error) {
        throw error;
    }
}

async function emailAlreadyExist(emailUser: string) {
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
        return false;
    }
}