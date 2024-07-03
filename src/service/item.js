class ItemService {
    constructor(itemRepository, userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    async getAll() {
        try {
            const itemList = await this.itemRepository.findAll()

            return {
                statusCode: 200,
                items: itemList
            }
        } catch (err) {

            return {
                statusCode: 500,
                createdItem: null
            }
        }
    }

    async add({ user_id, title, description, price, stock, img_url }) {
        try {
            //melakukan pengecekan value data yang dikirim
            if (!user_id || !title || !description || !price || !stock || !img_url) {
                throw new Error('data yang anda inputkan tidak sesuai');
            }

            // Cek apakah user_id ada
            const userExist = await this.userRepository.getById(user_id);


            if (!userExist) {
                return {
                    statusCode: 404,
                    message: "User ID tidak ditemukan"
                };
            }
            if (userExist.role !== "seller") {
                return {
                    statusCode: 404,
                    message: "Hanya seller yang dapat menambahkan item"
                }
            }


            const createdItem = await this.itemRepository.insert({ user_id, title, description, price, stock, img_url });

            return {
                statusCode: 201,
                createdItem: createdItem
            };

        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return {
                    statusCode: 409, // (conflict code)
                    message: "Conflict",
                    createdUser: null
                };
            }
            console.error("Error ", err);
            return {
                statusCode: 500,
                message: "Internal server error",
                createdItem: null
            };
        }
    }

    async update(itemId, item) {

        //melakukan pengecekan value data yang dikirim
        if (!item || !item.title || !item.description || !item.price || !item.stock || !item.img_url) {
            throw new Error('Invalid item data');
        }

        try {
            const updatedItem = await this.itemRepository.update(itemId, {
                title: item.title,
                description: item.description,
                price: item.price,
                stock: item.stock,
                img_url: item.img_url
            });

            return {
                statusCode: 200,
                updatedItem: updatedItem
            };

        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return {
                    statusCode: 409, //(conflict code)
                    message: "Conflict",
                    createdUser: null
                };
            }
            console.error("Error", err);
            return {
                statusCode: 500,
                message: "Internal server error",
                updatedItem: null
            };
        }
    }

    async remove(itemId) {
        try {

            const deletedItem = await this.itemRepository.remove(itemId);

            if (!deletedItem) {
                throw new Error('Item tidak ditemukan');
            }

            return {
                statusCode: 200,
                deletedItem: deletedItem
            };

        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return {
                    statusCode: 409, // (conflict code)
                    message: "Conflict",
                    deletedUser: null
                };
            }
            console.error("Error", err);
            return {
                statusCode: 500,
                message: "Internal server error",
                deletedItem: null
            };
        }
    }
}

module.exports = ItemService;