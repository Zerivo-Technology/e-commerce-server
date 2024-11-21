const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const { returnSuccess, returnError } = require('../../helpers/responseHandler');

class ProductsControllers {

    static async addProduct(req, res) {
        const { nameProduct, about, category, age, quantity, price } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({
                status: 400,
                message: "Image is required",
            });
        }

        try {
            const filePath = `images/${Date.now()}_${imageFile.originalname}`;
            const { data, error: uploadError } = await supabase.storage
                .from('imagesProducts')
                .upload(filePath, imageFile.buffer);

            if (uploadError) {
                throw new Error('Upload to Supabase failed: ' + uploadError.message);
            }

            const { data: publicURL } = supabase
                .storage
                .from('imagesProducts')
                .getPublicUrl(filePath);

            const newProduct = await prisma.product.create({
                data: {
                    nameProduct,
                    about,
                    category: {
                        connect: { id: parseInt(category, 10) },
                    },
                    age,
                    quantity: parseInt(quantity),
                    price: parseFloat(price),
                    image: publicURL.publicUrl
                }
            });

            return res.status(200).json({
                status: 200,
                message: "New Product Added",
                data: newProduct
            });

        } catch (error) {
            console.error('Error adding product:', error);
            return res.status(500).json({
                status: 500,
                message: 'Add Product Failed',
                error: error.message || error
            });

        }
    }

    static async getProducts(req, res, next) {
        try {
            const getProduct = await prisma.product.findMany({
                include: {
                    category: true

                }
            })
            const response = returnSuccess(200, "Get Products Successfully, new Response", getProduct)
            // -- Return Response  -- //
            return res.status(response.statusCode).json(response.response)
        } catch (error) {
            console.error('Error get product:', error);
            const response = returnError(400, "Get Products Failed")
            // -- Return Response  -- //
            return res.status(response.statusCode).json(response.response);
        }
    }

    static async getProductById(req, res, next) {
        const { id } = req.params
        try {
            const productById = await prisma.product.findUnique({
                where: {
                    id: id
                }
            })
            const response = returnSuccess(200, "Get Products by Id Successfully", productById)
            // -- Return Response  -- //
            res.status(response.statusCode).json(response.response)
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteProducts(req, res, next) {
        const { id } = req.params
        try {
            const deleteProducts = await prisma.product.delete({
                where: {
                    id: id
                }
            })

            const response = returnSuccess(200, 'Delete Product Successfully', deleteProducts)

            res.status(response.statusCode).json(response.response)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductsControllers;
