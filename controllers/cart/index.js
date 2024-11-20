const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
const { returnSuccess, returnError } = require('../../helpers/responseHandler');
class CartControllers {
    static async addCartProducts(req, res, next) {
        const { idProduct } = req.body;
        const userId = req.user?.id;

        if (!idProduct || !userId) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid input: Product ID and User ID are required',
            });
        }

        try {
            const existingCartItem = await Prisma.cart.findFirst({
                where: {
                    productId: idProduct,
                    userId: userId,
                },
            });

            if (existingCartItem) {
                const updatedCartItem = await Prisma.cart.update({
                    where: {
                        id: existingCartItem.id,
                    },
                    data: {
                        quantity: (parseInt(existingCartItem.quantity, 10) + 1),
                    },
                });

                return res.status(200).json({
                    statusCode: 200,
                    message: 'Product quantity updated successfully',
                    data: updatedCartItem,
                });
            } else {
                const addCart = await Prisma.cart.create({
                    data: {
                        productId: idProduct,
                        userId: userId,
                        quantity: 1,
                    },
                });

                return res.status(200).json({
                    statusCode: 200,
                    message: 'Product added to cart successfully',
                    data: addCart,
                });
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            return res.status(500).json({
                statusCode: 500,
                message: 'Add Cart Products failed',
                error: error.message,
            });
        }
    }

    static async deleteProductFromCart(req, res, next) {
        const { id } = req.params;
        try {
            const checkProduct = await Prisma.cart.findFirst({
                where: {
                    productId: id,
                },
            });

            if (!checkProduct) {
                const response = returnError(404, 'Product not found in cart');
                return res.status(response.statusCode).json(response.response);
            }

            if (parseInt(checkProduct.quantity) > 1) {
                const updateCartQuantity = await Prisma.cart.update({
                    where: {
                        id: checkProduct.id,
                    },
                    data: {
                        quantity: (parseInt(checkProduct.quantity) - 1),
                    },
                });

                const response = returnSuccess(200, 'Product quantity updated successfully', updateCartQuantity);
                return res.status(response.statusCode).json(response.response);
            } else {
                const deleteProduct = await Prisma.cart.delete({
                    where: {
                        id: checkProduct.id,
                    },
                });

                const response = returnSuccess(200, 'Product removed from cart successfully', deleteProduct);
                return res.status(response.statusCode).json(response.response);
            }
        } catch (error) {
            const response = returnError(400, 'Delete Product from Cart Failed', error);
            return res.status(response.statusCode).json(response.response);
        }
    }


    static async getCartUserById(req, res, next) {
        const userId = req.user.id;
        try {
            const cartItems = await Prisma.cart.findMany({
                where: {
                    userId: userId
                }
            });

            if (cartItems.length === 0) {
                const response = returnError(404, "Cart is empty or not found");
                return res.status(response.statusCode).json(response.response);
            }

            const response = returnSuccess(200, "Get Cart Products Successfully", cartItems);
            return res.status(response.statusCode).json(response.response);

        } catch (error) {
            const response = returnError(400, 'Something went wrong while fetching cart products', error);
            return res.status(response.statusCode).json(response.response);
        }
    }

}


module.exports = CartControllers