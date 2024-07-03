class ItemHandler {
    constructor(itemService) {
        this.itemService = itemService;

        this.getAll = this.getAll.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }


    async getAll(req, res) {
        const serviceRes = await this.itemService.getAll()


        res.status(serviceRes.statusCode).send({
            items: serviceRes.items
        })
    }

    async add(req, res) {
        const payload = req.body;

        const serviceRes = await this.itemService.add(payload);


        if (serviceRes.statusCode === 404) {
            return res.status(404).send({
                message: serviceRes.message
            });
        }

        if (serviceRes.statusCode === 201) {
            return res.status(201).send({
                created_item: serviceRes.createdItem
            });
        }

        return res.status(serviceRes.statusCode).send({
            message: serviceRes.message
        });

    }

    async update(req, res) {
        const itemId = req.params.id;
        const payload = req.body;

        const serviceRes = await this.itemService.update(itemId, payload);

        if (serviceRes.statusCode === 404) {
            return res.status(404).send({
                message: serviceRes.message
            });
        }

        if (serviceRes.statusCode === 200) {
            return res.status(200).send({
                updated_item: serviceRes.updatedItem
            });
        }

        return res.status(serviceRes.statusCode).send({
            message: serviceRes.message
        });

    }

    async remove(req, res) {
        const itemId = req.params.id;


        if (!itemId) {
            return res.status(400).send({
                message: "Invalid item ID"
            });
        }

        const serviceRes = await this.itemService.remove(itemId);

        if (serviceRes.statusCode === 404) {
            return res.status(404).send({
                message: serviceRes.message
            });
        }

        if (serviceRes.statusCode === 200) {
            return res.status(200).send({
                message: "Item successfully deleted"
            });
        }

        return res.status(serviceRes.statusCode).send({
            message: serviceRes.message
        });
    }
}

module.exports = ItemHandler;