class OrderHandler {
    constructor(orderService) {
        this.orderService = orderService;

        this.getAll = this.getAll.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);

    }


    async getAll(req, res) {
        const serviceRes = await this.orderService.getAll()

        res.status(serviceRes.statusCode).send({
            orders: serviceRes.orders
        })
    }
    async add(req, res) {
        const { user_id, item_id, order_date, address, quantity, total_price, status } = req.body;


        try {
            const serviceRes = await this.orderService.add({ user_id, item_id, order_date, address, quantity, total_price, status });

            res.status(serviceRes.statusCode).send({
                message: serviceRes.message || 'Order created successfully',
                order: serviceRes.createdOrder
            });
        } catch (err) {
            res.status(500).send({
                message: "Internal server error"
            });
        }
    }

    async update(req, res) {
        const orderId = req.params.id;
        const payload = req.body;

        const serviceRes = await this.orderService.update(orderId, payload);

        if (serviceRes.statusCode === 404) {
            return res.status(404).send({
                message: serviceRes.message
            });
        }

        if (serviceRes.statusCode === 200) {
            return res.status(200).send({
                updated_order: serviceRes.updatedOrder
            });
        }

        return res.status(serviceRes.statusCode).send({
            message: serviceRes.message
        });

    }

    async remove(req, res) {
        const orderId = req.params.id;


        if (!orderId) {
            return res.status(400).send({
                message: "Invalid order ID"
            });
        }

        const serviceRes = await this.orderService.remove(orderId);

        if (serviceRes.statusCode === 404) {
            return res.status(404).send({
                message: serviceRes.message
            });
        }

        if (serviceRes.statusCode === 200) {
            return res.status(200).send({
                message: "order successfully deleted"
            });
        }

        return res.status(serviceRes.statusCode).send({
            message: serviceRes.message
        });
    }

}

module.exports = OrderHandler;