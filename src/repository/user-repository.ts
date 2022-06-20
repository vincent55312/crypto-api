import { AppDataSource } from "../data-source"
import { User } from "../entity/user"

export async function createUser(user: User) {
    try {
        await AppDataSource.initialize();
        await AppDataSource.manager.save(user);
        await AppDataSource.destroy();
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