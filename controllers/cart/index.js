const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
const { returnSuccess, returnError } = require('../../helpers/responseHandler');
class CartControllers {
    static async addCartProducts(req, res, next) {
        const { idProduct } = req.body;
        const userId = req.user.id;

        try {
            let existingCart = await Prisma.cart.findFirst({
                where: {
                    userId: userId
                },
            });

            if (!existingCart) {
                existingCart = await Prisma.cart.create({
                    data: {
                        userId
                    }
                });
            }

            const existingProduct = await Prisma.productItem.findFirst({
                where: {
                    cartId: existingCart.id,
                    productId: idProduct
                },
            });

            if (existingProduct) {
                const updatedProduct = await Prisma.productItem.update({
                    where: {
                        id: existingProduct.id,
                    },
                    data: {
                        quantity: existingProduct.quantity + 1
                    }
                });

                const response = returnSuccess(200, 'Update Quantity Products', updatedProduct);
                return res.status(response.statusCode).json(response.response);
            }

            const addProductToCart = await Prisma.productItem.create({
                data: {
                    cartId: existingCart.id,
                    productId: idProduct,
                    quantity: 1
                }
            });

            const response = returnSuccess(200, "Add Product to cart successfully", addProductToCart);
            return res.status(response.statusCode).json(response.response);

        } catch (error) {
            console.error("Error while adding product to cart:", error);

            const response = returnError(400, "Add Product to cart has failed");
            return res.status(response.statusCode).json(response.response);
        }
    }


    static async reduceProductFromCart(req, res, next) {
        const { productId } = req.params; // ID produk dari parameter URL
        const userId = req.user.id; // ID pengguna dari middleware auth

        try {
            // Cari keranjang pengguna
            const cart = await Prisma.cart.findFirst({
                where: {
                    userId: userId
                },
                include: {
                    productItems: true
                }
            });

            if (!cart) {
                const response = returnError(404, "Cart not found");
                return res.status(response.statusCode).json(response.response);
            }

            // Cari produk dalam keranjang
            const productItem = await Prisma.productItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId: productId
                }
            });

            if (!productItem) {
                const response = returnError(404, "Product not found in the cart");
                return res.status(response.statusCode).json(response.response);
            }

            // Jika quantity lebih dari 1, kurangi quantity
            if (productItem.quantity > 1) {
                const updatedProductItem = await Prisma.productItem.update({
                    where: {
                        id: productItem.id
                    },
                    data: {
                        quantity: productItem.quantity - 1
                    }
                });

                const response = returnSuccess(200, "Reduced product quantity successfully", updatedProductItem);
                return res.status(response.statusCode).json(response.response);
            }

            // Jika quantity 1, hapus produk dari keranjang
            await Prisma.productItem.delete({
                where: {
                    id: productItem.id
                }
            });

            const response = returnSuccess(200, "Product removed from cart", null);
            return res.status(response.statusCode).json(response.response);
        } catch (error) {
            console.error("Error while reducing product quantity:", error);

            const response = returnError(500, "Failed to reduce product quantity");
            return res.status(response.statusCode).json(response.response);
        }
    }


    static async getCartUserById(req, res, next) {
        const userId = req.user.id;
        try {
            const cartUser = await Prisma.cart.findMany({
                where: {
                    userId: userId
                },
                include: {
                    productItems: {
                        include: {
                            products: {
                                include: {
                                    stoks: false,
                                    category: true
                                }
                            }
                        }
                    }
                }
            });

            if (cartUser.length === 0) {
                // Jika keranjang kosong
                const response = returnSuccess(200, "No products in the cart", []);
                return res.status(response.statusCode).json(response.response);
            }

            const response = returnSuccess(200, "Get product from cart successfully", cartUser);
            return res.status(response.statusCode).json(response.response);
        } catch (error) {
            console.error("Error while fetching cart details:", error);

            const response = returnError(400, "Get product from cart has failed");
            return res.status(response.statusCode).json(response.response);
        }
    }


}


module.exports = CartControllers