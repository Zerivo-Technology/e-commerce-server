const { signToken } = require('../../helpers/jwt');
const { checkPassword, hashPassword } = require('../../helpers/bcrypt');
const { PrismaClient } = require('@prisma/client');
const { returnSuccess, returnError } = require('../../helpers/responseHandler');
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
      console.log(error)
    }
  }

  static async deleteUserById(req, res, next) {
    const { id } = req.params
    try {
      const deleteUser = await prisma.user.delete({
        where: {
          id: id
        }
      })

      const response = returnSuccess(200, "Delete User By Id Successfully", deleteUser);
      res.status(response.statusCode).json(response.response);
    } catch (error) {
      const response = returnError(400, 'Something wrong', error);
      res.status(400).json(response.response)
    }
  }

  static async getUserById(req, res, next) {
    const { id } = req.params
    try {
      const getUser = await prisma.user.findFirst({
        where: {
          id: id
        }
      })
      const response = returnSuccess(200, 'Get user by id Successfully', getUser);
      res.status(response.statusCode).json(response.response)
    } catch (error) {
      const response = returnError(400, 'Something wrong', error);
      res.status(response.statusCode).json(response.response)
    }
  }

  static async updateUser(req, res, next) {
    const { id } = req.params;
    const { email, password, phoneNumber, role, name } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: id } });
      if (!user) {
        const response = returnError(404, "User not found");
        return res.status(response.statusCode).json(response.response);
      }

      const hashedPassword = password ? hashPassword(password) : undefined;

      const updateUser = await prisma.user.update({
        where: { id: id },
        data: {
          name: name || user.name,
          email: email || user.email,
          phoneNumber: phoneNumber || user.phoneNumber,
          role: role || user.role,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      const response = returnSuccess(200, "Update data user successfully", updateUser);
      return res.status(response.statusCode).json(response.response);
    } catch (error) {
      const response = returnError(400, "Something went wrong", error);
      return res.status(response.statusCode).json(response.response);
    }
  }


  static async addUser(req, res, next) {
    const { email, password, phoneNumber, name, role } = req.body;
    try {
      const checkEmail = await prisma.user.findFirst({
        where: {
          email
        }
      })

      if (checkEmail) {
        const response = returnError(401, "Email sudah tersedia", error);
        res.status(response.statusCode).json(response.response)
      }

      const hashedPassword = hashPassword(password)

      const createUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          phoneNumber: phoneNumber,
          name: name,
          role: role,
          provider: 'local'
        }
      })

      const response = returnSuccess(200, 'Create new user successfully', createUser);
      res.status(response.statusCode).json(response.response)
    } catch (error) {
      const response = returnError(400, 'Something wrong', error);
      res.status(response.statusCode).json(response.response)
    }
  }
}

module.exports = Controllers;
