const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
const { returnSuccess, returnError } = require('../../helpers/responseHandler');
class CartControllers {
    static async addCartProducts(req, res, next) {
        const { id } = req.params;
        const userId = req.user.id;

        try {

            const existingCartItem = await Prisma.cart.findFirst({
                where: {
                    productId: id,
                    userId: userId
                }
            });

            if (existingCartItem) {
                const updatedCartItem = await Prisma.cart.update({
                    where: {
                        id: existingCartItem.id
                    },
                    data: {
                        quantity: (parseInt(existingCartItem.quantity) + 1).toString()
                    }
                });

                const response = returnSuccess(200, 'Product quantity updated successfully', updatedCartItem);
                return res.status(response.statusCode).json(response.response);
            } else {

                const addCart = await Prisma.cart.create({
                    data: {
                        productId: id,
                        userId: userId,
                        quantity: "1"
                    }
                });

                const response = returnSuccess(200, 'Product added to cart successfully', addCart);
                // -- Return Response -- //
                return res.status(response.statusCode).json(response.response);
            }

            next();
        } catch (error) {
            const response = returnError(400, 'Add Cart Products failed', error);
            // -- Return Response -- //
            return res.status(response.statusCode).json(response.response);
            next();
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
                        quantity: (parseInt(checkProduct.quantity) - 1).toString(),
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