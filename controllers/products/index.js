const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const prisma = new PrismaClient();
require('dotenv').config();
const supabaseUrl = 'https://zxbxtnkyleblalhoknyk.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Ynh0bmt5bGVibGFsaG9rbnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NDEwMjksImV4cCI6MjA0NzIxNzAyOX0.H3x6OJ8JZiM9Q9B9LHHtgGjDKB-cdtigIOmalRTTd0U";
const supabase = createClient(supabaseUrl, supabaseKey);

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

            const newProduct = await prisma.products.create({
                data: {
                    nameProduct,
                    about,
                    category,
                    age,
                    quantity,
                    price,
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
            const getProduct = await prisma.products.findMany();
            return res.status(200).json({
                status: 200,
                message: "Get Products Successfully",
                data: getProduct
            });
        } catch (error) {
            console.error('Error get product:', error);
            return res.status(500).json({
                status: 500,
                message: 'Get Product Failed',
                error: error.message || error
            });
        }
    }

    static async getProductById(req, res, next) {
        const { id } = req.params
        try {
            const productById = await prisma.products.findUnique({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                status: 200,
                message: "Get Product By Id Successfully",
                data: productById
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductsControllers;
