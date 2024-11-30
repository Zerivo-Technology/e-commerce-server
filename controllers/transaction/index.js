const { PrismaClient } = require('@prisma/client');
const { returnSuccess, returnError } = require('../../helpers/responseHandler');
const prisma = new PrismaClient();

class TransactionHandler {
    static async addTransaction(req, res, next) {
        const userId = req.user.id;
        const { paymentMethod, selectedProductItemsId, couponId } = req.body;

        try {
            if (!paymentMethod || !Array.isArray(selectedProductItemsId) || selectedProductItemsId.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Payment Method dan product harus dipilih",
                });
            }

            const getCartItem = await prisma.cart.findMany({
                where: {
                    userId: userId,
                    productItems: {
                        some: {
                            id: { in: selectedProductItemsId },
                        },
                    },
                },
                include: {
                    productItems: {
                        include: {
                            products: true,
                        },
                    },
                },
            });

            if (!getCartItem.length) {
                return res.status(404).json({
                    status: 404,
                    message: "Item tidak ditemukan di keranjang",
                });
            }

            const coupon = couponId
                ? await prisma.coupon.findUnique({
                    where: { id: couponId },
                })
                : null;

            if (couponId && !coupon) {
                return res.status(404).json({
                    status: 404,
                    message: "Kupon tidak ditemukan",
                });
            }

            if (coupon && new Date(coupon.expire_date) < new Date()) {
                return res.status(400).json({
                    status: 400,
                    message: "Kupon sudah kadaluarsa",
                });
            }

            let total = 0;
            getCartItem.forEach((cart) => {
                cart.productItems.forEach((item) => {
                    total += item.quantity * item.products.price;
                });
            });

            if (coupon) {
                total -= coupon.cut_price;
            }

            const orderId = `ORD-${Date.now()}`;

            const newTransaction = await prisma.transaction.create({
                data: {
                    userId,
                    order_id: orderId,
                    paymentMethod,
                    total,
                    couponId: couponId || null,
                },
            });

            for (const cart of getCartItem) {
                for (const item of cart.productItems) {
                    await prisma.transactionItem.create({
                        data: {
                            transactionId: newTransaction.id,
                            productItemsId: item.id,
                            quantity: item.quantity,
                        },
                    });
                }
            }

            res.status(200).json({
                status: 200,
                message: "Transaksi berhasil dibuat",
                data: newTransaction,
            });
        } catch (error) {
            console.error("Error in addTransaction:", error);
            res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
            });
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
        const { id } = req.params
        try {
            const getTransactionById = await prisma.transaction.findMany({
                where: {
                    id: id
                }
            })

            res.status(200).json({
                status: 200,
                message: "Detail Transaksi",
                getTransactionById
            })

        } catch (error) {
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
