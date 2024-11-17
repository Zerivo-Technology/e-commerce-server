const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');
const { signToken } = require('../../helpers/jwt'); // Pastikan fungsi ini benar

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient(); // Inisialisasi Prisma Client

class googleAuthControllers {
    static async authenticationGoogle(req, res, next) {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                status: 400,
                message: 'Token is required',
            });
        }

        try {
            // Verifikasi token Google
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID || '',
            });

            const payload = ticket.getPayload();
            const userPayload = {
                id_google: payload.sub,
                fullName: payload.name,
                email: payload.email,
                image: payload.picture,
                time: new Date(),
            };

            // Cek apakah pengguna sudah ada di database
            let user = await prisma.user.findUnique({
                where: { email: userPayload.email },
            });

            if (!user) {
                // Jika pengguna belum ada, buat data baru
                user = await prisma.user.create({
                    data: {
                        googleId: userPayload.id_google,
                        name: userPayload.fullName,
                        email: userPayload.email,
                        imageUrl: userPayload.image,
                        role: 'user', // Role default
                    },
                });
            }

            // Buat access token menggunakan fungsi signToken
            const access_token = signToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            // Kirimkan respons sukses
            res.status(200).json({
                status: 200,
                message: 'Authentication Successfully',
                data: {
                    name: user.name,
                    access_token,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: 'Authentication Failed',
                error: error.message,
            });
        }
    }
}

module.exports = googleAuthControllers;
