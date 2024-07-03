class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async login({ email, password }) {
        const existingUser = await this.userRepository.getByEmail(email);

        if (!existingUser) {
            return {
                message: "Gagal login: Email tidak terdaftar"
            };
        }

        if (existingUser.password !== password) {
            return {
                message: "Gagal login: Password salah"
            };
        }
        if (existingUser.email !== email) {
            return {
                message: "Gagal login: email salah"
            };
        }
        return {
            message: "Login berhasil",
        };
    }

    async register({ name, email, password, address, role }) {
        try {
            const emailExist = await this.userRepository.getByEmail(email);

            if (emailExist) {
                return {
                    statusCode: 409, // Conflict status code
                    message: "Email already exists",
                    createdUser: null
                };
            }
            const createdUser = await this.userRepository.insert({ name, email, password, address, role });

            return {
                statusCode: 201, // Created status code
                message: "User registered successfully",
                createdUser: createdUser
            };

        } catch (err) {
            // if (err.message.includes('duplicate key value violates unique constraint')) {
            //     return {
            //         statusCode: 409, // Conflict status code
            //         message: "Email already exists",
            //         createdUser: null
            //     };
            // }

            console.error("Error during registration:", err);
            return {
                statusCode: 500, // Internal Server Error status code
                message: "Internal server error",
                createdUser: null
            }
        }
    }
}

module.exports = AuthService;