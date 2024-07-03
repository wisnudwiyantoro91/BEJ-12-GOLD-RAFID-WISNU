class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAll() {
        try {
            const userList = await this.userRepository.findAll()

            return {
                statusCode: 200,
                users: userList
            }
        } catch (err) {

            return {
                statusCode: 500,
                createdUser: null
            }
        }
    }

    async getByEmail(email) {
        try {
            const emailExist = await this.userRepository.getByEmail(email);

            if (emailExist) {
                return {
                    statusCode: 200,
                    user: emailExist
                };
            } else {
                return {
                    statusCode: 404,
                    user: null,
                    message: 'User not found'
                };
            }
        } catch (error) {
            return {
                statusCode: 500,
                user: null,
                message: 'Internal server error'
            };
        }
    }
}

module.exports = UserService;