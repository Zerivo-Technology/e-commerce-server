const { PrismaClient } = require('@prisma/client');
const { returnSuccess, returnError } = require('../../helpers/responseHandler');
const prisma = new PrismaClient();

class TransactionHandler {
    static async addTransaction(req, res, next) {
        try {
            const userId = req.user.id;
            const { paymentMethod, selectedProductIds } = req.body;

            if (!userId || !paymentMethod || !Array.isArray(selectedProductIds) || selectedProductIds.length === 0) {
                return res.status(400).json({
                    message: "userId, paymentMethod, dan selectedProductIds harus disediakan.",
                });
            }

            const cartItems = await prisma.productItem.findMany({
                where: {
                    carts: { userId },
                    productId: { in: selectedProductIds },
                },
                include: {
                    products: true,
                },
            });

            if (cartItems.length === 0) {
                return res.status(404).json({
                    message: "Tidak ada item yang ditemukan di keranjang dengan produk yang dipilih.",
                });
            }

            const total = cartItems.reduce((acc, item) => {
                return acc + item.products.price * item.quantity;
            }, 0);

            const timestamp = new Date().getTime();
            const orderId = `${timestamp}`;

            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    order_id: orderId,
                    total,
                    paymentMethod,
                    paymentStatus: false,
                    transactionItems: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            size: item.sizeId
                        })),
                    },
                },
                include: {
                    transactionItems: true,
                },
            });

            await prisma.productItem.deleteMany({
                where: {
                    carts: { userId },
                    productId: { in: selectedProductIds },
                },
            });

            res.status(200).json({
                status: 200,
                message: "New Transaction Created",
                data: transaction
            })
        } catch (error) {
            console.error("Error in addTransaction:", error);
            next(error);
        }
    }



    static async getAllTransaction(req, res, next) {
        const idUser = req.user.id
        try {
            const myTransaction = await prisma.transaction.findMany({
                where: {
                    userId: idUser
                }
            });

            const response = returnSuccess(200, "Berhasil mendapatkan semua transaksi", myTransaction);

            return res.status(response.statusCode).json(response.response);
            next()
        } catch (error) {
            const response = returnError(400, "Gagal mendapatkan transaksi");

            return res.status(response.statusCode).json(response.response)
        }
    }

    static async getTransactionItemDetails(req, res, next) {
        const { id } = req.params;

        try {
            const getTransactionById = await prisma.transaction.findUnique({
                where: { id },
                include: {
                    transactionItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!getTransactionById) {
                const response = returnError(404, "Transaction not found");
                return res.status(response.statusCode).json(response.response);
            }

            const response = returnSuccess(
                200,
                "Get Details Transaction Successfully",
                getTransactionById
            );

            return res.status(response.statusCode).json(response.response);
        } catch (error) {
            console.error(error);

            const response = returnError(500, "Get Details Transaction failed");
            return res.status(response.statusCode).json(response.response);
        }
    }


    static async deleteTransaction(req, res, next) {
        const { id } = req.params
        try {
            const deleteTransaction = await prisma.transaction.delete({
                where: {
                    id: id
                }
            })

            res.status(200).json({
                status: 200,
                message: "Delete transaction Successfully",
                data: deleteTransaction
            })

        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = TransactionHandler;
