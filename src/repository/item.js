const { item: ItemModel, user: UserModel } = require('../../models')

class ItemRepository {
    constructor() {}

    async findAll() {
        const itemList = await ItemModel.findAll({
            include: [{
                    model: UserModel,
                    required: true,
                    as: "user"
                }

            ]
        });

        return itemList;
    }

    async findById(itemId) {
        const item = await ItemModel.findOne({
            where: { id: itemId },
            include: [{
                model: UserModel,
                required: true,
                as: 'user'
            }]
        });

        if (!item) {
            throw new Error('Item tidak ditemukan');
        }

        return item;
    }

    async insert(item) {
        const createdItem = await ItemModel.create({
            user_id: item.user_id,
            title: item.title,
            description: item.description,
            price: item.price,
            stock: item.stock,
            img_url: item.img_url
        });

        return createdItem;
    }

    async update(itemId, item) {
        if (!item || !item.title || !item.description || !item.price || !item.stock || !item.img_url) {
            throw new Error('Invalid item data');
        }
        const updatedItem = await ItemModel.update({
            user_id: item.userId,
            title: item.title,
            description: item.description,
            price: item.price,
            stock: item.stock,
            img_url: item.img_url,
        }, {
            where: {
                id: itemId
            }
        });

        return updatedItem;
    }

    async updateStock(itemId, newStock, options) {
        const updatedItem = await ItemModel.update({
            stock: newStock
        }, {
            where: { id: itemId },
            transaction: options.transaction // Pastikan untuk melewatkan transaksi di sini
        });

        return updatedItem;
    }

    async remove(itemId) {

        const deletedItem = await ItemModel.destroy({
            where: {
                id: itemId
            }
        });

        if (!deletedItem) {
            throw new Error('Item tidak ditemukan');
        }

        return deletedItem;

    }


}

module.exports = ItemRepository;