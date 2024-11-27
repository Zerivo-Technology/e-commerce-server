const midtransClient = require("midtrans-client");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config();

class PaymentControllers {
    static async PaymentMidtrans(req, res) {
        const { transactionId } = req.params;

        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        try {
            const findTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
                include: {
                    user: true,
                    transactionItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!findTransaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            let orderId = findTransaction.order_id;

            if (orderId) {
                const timestamp = new Date().getTime();
                const orderId = `${timestamp}`;

                await prisma.transaction.update({
                    where: { id: findTransaction.id },
                    data: { order_id: orderId },
                });
            }

            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: findTransaction.total,
                },
                customer_details: {
                    first_name: findTransaction.user.name,
                    email: findTransaction.user.email,
                },
                item_details: findTransaction.transactionItems.map((item) => ({
                    id: item.product.id,
                    price: item.product.price,
                    quantity: item.quantity,
                    name: item.product.nameProduct,
                })),
            };

            const response = await snap.createTransaction(parameter);

            res.status(200).json({
                status: 200,
                message: "Transaction URL created",
                snapUrl: response.redirect_url,
            });
        } catch (error) {
            console.error("Midtrans API Error:", error);
            res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                error: error.message || error,
            });
        }
    }

}

module.exports = PaymentControllers;
