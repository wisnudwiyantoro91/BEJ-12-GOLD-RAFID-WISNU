const { user: UserModel } = require('../../models');

class UserRepository {
    constructor() {}

    async findAll() {
        const userList = await UserModel.findAll();
        return userList;
    }

    async insert(user) {
        const createdUser = await UserModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            address: user.address,
            role: user.role
        });
        return createdUser;
    }

    async getByEmail(email) {
        const userExist = await UserModel.findOne({ where: { email } });
        return userExist;
    }
    async getById(user_id) {
        const user = await UserModel.findByPk(user_id);
        return user;
    }


}

module.exports = UserRepository;