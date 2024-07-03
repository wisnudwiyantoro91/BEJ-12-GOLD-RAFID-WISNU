class AuthHandler {
    constructor(authService) {
        this.authService = authService;

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    async login(req, res) {
        const { email, password } = req.body;

        const users = await this.authService.login({ email, password });

        if (!users) {
            return res.status(400).send({
                message: users.message
            });
        }

        res.status(200).send({
            message: users.message
        });
    }

    async register(req, res) {
        const payload = req.body;
        const serviceRes = await this.authService.register(payload);

        console.log("service user", serviceRes);

        if (serviceRes.statusCode === 409) {
            return res.status(409).send({
                message: serviceRes.message
            });
        }

        if (serviceRes.statusCode === 201) {
            return res.status(201).send({
                created_user: serviceRes.createdUser
            });
        }

        if (serviceRes.statusCode === 500) {
            return res.status(500).send({
                message: serviceRes.message
            });
        }

        return res.status(400).send({
            message: "Unknown error occurred"
        });
    }
}

module.exports = AuthHandler;