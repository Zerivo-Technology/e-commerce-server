const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient()

class TransactionControllers {
    static async addTransaction(req, res, next) {
        const { id } = req.user.id
        const { idCart } = req.params
        try {

        } catch (error) {

        }
    }
}

module.exports = TransactionControllers