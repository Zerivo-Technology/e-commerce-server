const midtransClient = require("midtrans-client");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

class PaymentControllers {
    static async PaymentMidtrans(req, res) {
        const { transactionId } = req.params;

        let snap = new midtransClient.Snap({
            isProduction: false, // Ubah ke `true` jika sudah di produksi
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        try {
            // Cari transaksi berdasarkan ID
            const findTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
                include: {
                    user: true,
                    transactionItems: {
                        include: {
                            productItems: {
                                include: {
                                    products: true,
                                },
                            },
                        },
                    },
                },
            });

            // Periksa apakah transaksi ditemukan
            if (!findTransaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            // Periksa atau buat `order_id`
            let orderId = findTransaction.order_id;

            if (!orderId) {
                const timestamp = new Date().getTime();
                orderId = `ORDER-${timestamp}`;
                await prisma.transaction.update({
                    where: { id: findTransaction.id },
                    data: { order_id: orderId },
                });
            }

            // Hitung total transaksi (gross amount)
            const grossAmount = findTransaction.transactionItems.reduce((total, item) => {
                return (
                    total +
                    item.productItems.products.price * item.quantity
                );
            }, 0);

            // Detail transaksi untuk Midtrans
            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: grossAmount,
                },
                customer_details: {
                    first_name: findTransaction.user.name || "Customer",
                    email: findTransaction.user.email || "noemail@example.com",
                },
                item_details: findTransaction.transactionItems.map((item) => ({
                    id: item.productItems.products.id,
                    price: item.productItems.products.price,
                    quantity: item.quantity,
                    name: item.productItems.products.nameProduct,
                })),
            };

            // Buat transaksi menggunakan Midtrans
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
