const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient()
const { returnSuccess, returnError } = require('../../helpers/responseHandler');

class CategoryControllers {
    static async addCategory(req, res, next) {
        const { nameCategory } = req.body
        try {
            const newCategory = await Prisma.category.create({
                data: {
                    nameCategory
                }
            })

            const response = returnSuccess(200, 'Create new category successfull', newCategory)
            // Return Responses //    
            res.status(response.statusCode).json(response.response)
        } catch (error) {
            const response = returnError(400, 'Create new category has failed');
            // Return Responses //
            res.status(response.statusCode).json(response.response)
        }
    }

    static async getAllCategory(req, res, next) {
        try {
            const allCategory = await Prisma.category.findMany();
            const response = returnSuccess(200, "Get All Category Successfully", allCategory)

            // Return Response //
            res.status(response.statusCode).json(response.response)
        } catch (error) {
            const response = returnSuccess(400, 'Get Category has Failed')
            res.status(response.statusCode).json(response.response)
            next()
        }
    }
    static async deleteCategory(req, res) {
        const { id } = req.params;
        try {
            // Validasi ID
            if (!id || isNaN(parseInt(id, 10))) {
                const response = returnError(400, 'Invalid ID');
                return res.status(response.statusCode).json(response.response);
            }

            const deleteCategory = await Prisma.category.delete({
                where: { id: parseInt(id) }
            });

            const response = returnSuccess(200, 'Delete Category Successfully', deleteCategory);
            res.status(response.statusCode).json(response.response);
        } catch (error) {

            const response = returnError(500, 'Internal Server Error');
            res.status(response.statusCode).json(response.response);
        }
    }

    static async updateCategory(req, res, next) {
        const { id } = req.params
        const { nameCategory } = req.body
        try {
            if (!id || isNaN(parseInt(id, 10))) {
                const response = returnError(400, 'Invalid ID');
                return res.status(response.statusCode).json(response.response)
            }

            if (!nameCategory || typeof nameCategory !== 'string') {
                const response = returnError(400, 'Invalid category name');
                return res.status(response.statusCode).json(response.response);
            }

            const updateCategory = await Prisma.category.update({
                where: {
                    id: parseInt(id)
                }, data: {
                    nameCategory
                }
            })

            const response = returnSuccess(200, 'Update Category Successfully', updateCategory)

            // Return Response //
            res.status(response.statusCode).json(response.response)
        } catch (error) {

            const response = returnError(400, "Update Category has Failed")

            res.status(response.statusCode).json(response.response)

            next()
        }
    }

}
module.exports = CategoryControllers