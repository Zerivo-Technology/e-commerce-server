const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient;


class SizeControllers {

    static async getSize(req, res, next) {
        try {
            const getSize = await Prisma.size.findMany()
            res.status(200).json({
                status: 200,
                message: "Get size successfully",
                data: getSize
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Get size failed",
                error: error
            })
        }
    }

    static async addSize(req, res, next) {
        const { size } = req.body
        try {
            const newSize = await Prisma.size.create({
                data: {
                    size
                }
            })

            res.status(200).json({
                status: 200,
                message: "Create new size successfully",
                data: newSize
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Something Wrong",
                error: error
            })
        }
    }

    static async deleteSize(req, res, next) {
        const { id } = req.params
        try {
            const deleteSize = await Prisma.size.delete({
                where: {
                    id: parseInt(id)
                }
            })

            res.status(200).json({
                status: 200,
                message: "delete size successfully",
                data: deleteSize
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Something wrong",
                error: error
            })

        }
    }

}

module.exports = SizeControllers