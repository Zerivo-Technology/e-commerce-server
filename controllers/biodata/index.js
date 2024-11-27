const { PrismaClient } = require('@prisma/client');
const { returnError } = require('../../helpers/responseHandler');
const prisma = new PrismaClient();

class BiodataControllers {
    static async addBiodata(req, res, next) {
        const userId = req.user.id;
        const { tanggal_lahir, jenis_kelamin, alamatLengkap } = req.body;

        try {
            const checkBiodataUser = await prisma.biodata.findFirst({
                where: {
                    userId: userId,
                },
            });

            if (!checkBiodataUser) {
                const createBiodata = await prisma.biodata.create({
                    data: {
                        userId,
                        tanggal_lahir,
                        jenis_kelamin,
                        alamatLengkap,
                    },
                });

                return res.status(200).json({
                    status: true,
                    code: 200,
                    message: "Biodata Added Successfully",
                    data: createBiodata,
                });
            } else {
                const updateBiodata = await prisma.biodata.update({
                    where: { id: checkBiodataUser.id },
                    data: {
                        tanggal_lahir,
                        jenis_kelamin,
                        alamatLengkap,
                    },
                });

                return res.status(200).json({
                    status: true,
                    code: 200,
                    message: "Update Biodata Successfully",
                    data: updateBiodata,
                });
            }
        } catch (error) {
            console.error("Error Details:", error);
            const response = returnError(500, 'Something went wrong while adding/updating biodata', error.message);

            return res.status(response.statusCode).json(response.response);
        }
    }


    static async getMyBiodata(req, res, next) {
        const userId = req.user.id;

        try {
            const response = await prisma.biodata.findFirst({
                where: {
                    userId: userId,
                }, include: {
                    user: true
                }
            });

            res.status(200).json({
                status: 200,
                message: "Get Biodata Successfully",
                data: response,
            });
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Biodata Tidak Dapat Ditemukan",
            });
        }
    }

}

module.exports = BiodataControllers;
