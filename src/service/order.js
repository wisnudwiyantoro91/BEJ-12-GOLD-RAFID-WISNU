const { sequelize } = require('../../models');
class OrderService {
    constructor(orderRepository, itemRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
    }

    async getAll() {
        try {
            const orderList = await this.orderRepository.findAll()

            return {
                statusCode: 200,
                orders: orderList
            }
        } catch (err) {

            return {
                statusCode: 500,
                createdOrder: null
            }
        }
    }

    async add({ user_id, item_id, address, quantity, status }) {
        let transaction;

        try {
            if (!user_id || !item_id || !address || !quantity || !status) {
                throw new Error('Data yang anda inputkan tidak sesuai');
            }

            const item = await this.itemRepository.findById(item_id);
            if (!item) {
                throw new Error('Item tidak ditemukan');
            }

            if (item.stock < quantity) {
                throw new Error('Stok tidak mencukupi');
            }

            // Menghitung total price 
            const total_price = item.price * quantity;

            // Mulai transaksi
            transaction = await sequelize.transaction();

            // Membuat pesanan
            const createdOrder = await this.orderRepository.insert({ user_id, item_id, address, quantity, total_price, status }, { transaction });

            // Mengurangi stok item
            await this.itemRepository.updateStock(item_id, item.stock - quantity, { transaction });

            // Commit transaksi
            await transaction.commit();

            return {
                statusCode: 201,
                createdOrder
            };

        } catch (err) {
            // Rollback transaksi jika terjadi kesalahan
            if (transaction) await transaction.rollback();

            if (err.message.includes('duplicate key value violates unique constraint')) {
                return {
                    statusCode: 409,
                    message: "Conflict",
                    createdOrder: null
                };
            }
            console.error("Error ", err);
            return {
                statusCode: 500,
                message: "Internal server error",
                createdOrder: null
            };
        }
    }


    async update(orderId, item) {

        //melakukan pengecekan value data yang dikirim
        if (!item) {
            throw new Error('Invalid item data');
        }

        try {
            const updatedOrder = await this.orderRepository.update(orderId, {
                status: item.status,
            });

            return {
                statusCode: 200,
                updatedOrder: updatedOrder
            };

        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return {
                    statusCode: 409, //(conflict code)
                    message: "Conflict",
                    updatedOrder: null
                };
            }
            console.error("Error", err);
            return {
                statusCode: 500,
                message: "Internal server error",
                updatedOrder: null
            };
        }
    }

    async remove(orderId) {
        let transaction;

        try {
            // Ambil detail order yang akan dihapus
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Pesanan tidak ditemukan');
            }

            // Ambil detail item yang terkait dengan pesanan
            const item = await this.itemRepository.findById(order.item_id);
            if (!item) {
                throw new Error('Item tidak ditemukan');
            }

            // Mulai transaksi
            transaction = await sequelize.transaction();

            // Hapus order dari repository
            const deletedOrder = await this.orderRepository.remove(orderId, { transaction });

            // Kembalikan stok item
            await this.itemRepository.updateStock(order.item_id, item.stock + order.quantity, { transaction });

            // Commit transaksi
            await transaction.commit();

            return {
                statusCode: 200,
                deletedOrder: deletedOrder
            };

        } catch (err) {
            // Rollback transaksi jika terjadi kesalahan
            if (transaction) await transaction.rollback();

            console.error("Error", err);
            return {
                statusCode: 500,
                message: "Internal server error",
                deletedOrder: null
            };
        }
    }



}

module.exports = OrderService;