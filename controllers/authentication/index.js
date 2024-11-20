const googleClient = require('../../helpers/google-auth');
require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const { signToken } = require('../../helpers/jwt');
const prisma = new PrismaClient();

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
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const userPayload = {
                id_google: payload.sub,
                fullName: payload.name,
                email: payload.email,
                time: new Date(),
            };

            let user = await prisma.user.findUnique({
                where: { email: userPayload.email },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        googleId: userPayload.id_google,
                        name: userPayload.fullName,
                        email: userPayload.email,
                        provider: 'google',
                        role: 'user',
                    },
                });
            }

            const access_token = signToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

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

    static async authenticationFacebook(req, res, next){
        try{

        }catch(error){
            
        }
    }
}

module.exports = googleAuthControllers;
