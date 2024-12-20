const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient()
const { returnSuccess, returnError } = require('../../helpers/responseHandler')

class CouponControllers {
    static async getAllCoupon(req, res, next) {
        try {
            const getAllCoupon = await Prisma.coupon.findMany();
            const response = returnSuccess(200, 'Get Coupon Success', getAllCoupon);
            res.status(response.statusCode).json(response.response)
        } catch (error) {
            const response = returnError(400, 'Get All Coupon Failed');
            res.status(response.statusCode).json(response.response)

        }
    }

    static async addCoupon(req, res, next) {
        const { name, cut_price, expire_date } = req.body;

        try {
            if (!expire_date) {
                return res.status(400).json({
                    status: 400,
                    message: 'Expire date is required',
                });
            }

            const parsedExpireDate = new Date(expire_date);

            if (isNaN(parsedExpireDate.getTime())) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid expire date format, use YYYY-MM-DD',
                });
            }

            parsedExpireDate.setHours(0, 0, 0, 0);

            const newCoupon = await Prisma.coupon.create({
                data: {
                    name,
                    cut_price,
                    expire_date: parsedExpireDate,
                },
            });

            const response = returnSuccess(200, 'Add Coupon Successfully', newCoupon);

            // -- Return Response -- //
            res.status(response.statusCode).json(response.response);

        } catch (error) {
            const response = returnError(400, "Add Coupon Failed", error);
            res.status(response.statusCode).json(response.response);
        }
    }


    static async deleteCoupon(req, res, next) {
        const { id } = req.params;
        try {
            const couponId = await Prisma.coupon.delete({
                where: {
                    id: id
                }
            });

            const response = returnSuccess(200, 'Delete Coupon Successfully', couponId);
            res.status(response.statusCode).json(response.response);
        } catch (error) {
            const response = returnError(400, 'Delete Coupon failed', error);
            res.status(response.statusCode).json(response.response);
        }
    }

}

module.exports = CouponControllers