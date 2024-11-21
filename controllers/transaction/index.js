const { PrismaClient } = require('@prisma/client');
const { returnError } = require('../../helpers/responseHandler');
const Prisma = new PrismaClient()


class TransactionControllers {
    static async addTransaction(req, res, next) {
        const userId = req.user.id;

        try {
            const cartItems = await Prisma.cart.findMany({
                where: { userId: userId },
                include: { product: true }
            })

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ status: 'error', message: 'Keranjang kosong' });
            }

            let totalPrice = 0;
            const transactionItems = cartItems.map((item) => {
                const subTotal = item.product.price * item.quantity;
                totalPrice += subTotal
                return {
                    productId: item.productId,
                    quantity: item.quantity
                }
            })

            const newTransaction = await Prisma.transaction.create({
                data: {
                    total: totalPrice,
                    paymentMethod: 'midtrans',
                    paymentStatus: false,
                    userId: userId
                }
            })

            for (const item of transactionItems) {
                await Prisma.transactionItem.create({
                    data: {
                        transactionId: newTransaction.id,
                        productId: item.productId,
                        quantity: item.quantity
                    }
                })
            }

            await Prisma.cart.deleteMany({ where: { userId: userId } });

            const snap = new midtransClient.Snap({
                isProduction: false,
                serveKey: process.env.MIDTRANS_SERVER_KEY,
                clientKey: process.env.MIDTRANS_CLIENT_KEY
            })

            const parameter = {
                transaction_details: {
                    order_id: `ORDER-${newTransaction.id}`,
                    gross_amount: totalPrice
                },
                customer_details: {
                    email: req.user.email,
                    phone: req.user.phoneNumber,
                },
                item_details: cartItems.map((item) => ({
                    id: item.productId,
                    price: item.product.price,
                    quantity: item.quantity,
                    name: item.product.nameProduct,
                })),
            }

            const midtransResponse = await snap.createTransaction(parameter);

            return res.status(201).json({
                status: 'success',
                message: 'Transaksi berhasil dibuat',
                data: {
                    transactionId: newTransaction.id,
                    snapToken: midtransResponse.token,
                    paymentUrl: midtransResponse.redirect_url,
                },
            });

        } catch (error) {
            console.error('Error creating transaction:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal membuat transaksi',
                error: error.message,
            });
        }
    }
}


module.exports = TransactionControllers