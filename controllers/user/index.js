const { signToken } = require('../../helpers/jwt');
const { checkPassword, hashPassword } = require('../../helpers/bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Controllers {
    static async userRegister(req, res) {
        const { name, email, password, phoneNumber } = req.body;
        const role = 'user';
        const provider = 'local';
      
        // Validasi input
        if (!name || !email || !password || !phoneNumber) {
          return res.status(401).json({
            status: 401,
            message: 'All fields are required',
          });
        }
      
        try {
          // Cek apakah email sudah ada
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });
      
          if (existingUser) {
            return res.status(400).json({
              status: 400,
              message: 'Email already registered',
            });
          }
      
          // Hash password
          const hashedPassword = hashPassword(password);
      
          // Buat user baru
          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              phoneNumber,
              role,
              provider,
            },
          });
      
          // Kirim response sukses
          return res.status(200).json({
            status: 200,
            message: 'Register Success',
            data: newUser,
          });
        } catch (error) {
          console.log(error);
          // Tangani kesalahan dengan lebih baik
          return res.status(500).json({
            status: 500,
            message: 'Register Failed',
            error: error.message,
          });
        }
      }
      

    static async userLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user || !checkPassword(password, user.password)) {
                return res.status(401).json({
                    status: 401,
                    message: 'Invalid Email/Password'
                });
            }

            const access_token = signToken({ id: user.id, email: user.email, role: user.role });

            res.status(200).json({
                status: 200,
                message: "Login Successfully",
                data: {
                    email: user.email,
                    access_token,
                    role: user.role
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: 'Login Failed',
                error: error.message
            });
        }
    }

    static async getAllUser(req, res, next) {
        try {
            const allUser = await prisma.user.findMany()
            res.status(200).json({
                status: 200,
                message: "Get All User Successfully",
                data: allUser
            });
        } catch (error) {

        }
    }
}

module.exports = Controllers;
