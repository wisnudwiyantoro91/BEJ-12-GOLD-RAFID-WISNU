class AuthHandler {
    constructor(userService) {
        this.userService = userService;

        this.getAll = this.getAll.bind(this);
        this.getByEmail = this.getByEmail.bind(this);
    }


    async getAll(req, res) {
        const serviceRes = await this.userService.getAll()

        res.status(serviceRes.statusCode).send({
            users: serviceRes.users
        })
    }

    async getByEmail(req, res) {
        const { email } = req.params;

        const serviceRes = await this.userService.getByEmail(email);

        res.status(serviceRes.statusCode).send({
            user: serviceRes.user,
            message: serviceRes.message
        });
    }
}

module.exports = AuthHandler;