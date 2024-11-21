const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user');
const ProductsControllers = require('../controllers/products');
const AuthControllers = require('../controllers/authentication')
const CartControllers = require('../controllers/cart');
const CategoryControllers = require('../controllers/category');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authenticateToken, authorizationOnlyAdmin } = require('../middlewares/auth');
const CouponControllers = require('../controllers/coupon');
const TransactionControllers = require('../controllers/transaction');

// -- ROOT -- //

router.post('/register', UserControllers.userRegister);
router.post('/login', UserControllers.userLogin);
router.post('/google', AuthControllers.authenticationGoogle);
router.post('/facebook', AuthControllers.authenticationFacebook);

router.use(authenticateToken);

// -- TRANSACTIONS -- //
router.post('/transaction', TransactionControllers.addTransaction)

// -- BIODATA -- //

// -- PRODUCTS -- //
router.get('/products', ProductsControllers.getProducts);
router.get('/products/:id', ProductsControllers.getProductById);

// -- CARTS -- //
router.get('/cart', CartControllers.getCartUserById);
router.post('/cart', CartControllers.addCartProducts);
router.delete('/cart/:productId', CartControllers.reduceProductFromCart);

// -- COUPON -- //
router.get('/coupon', CouponControllers.getAllCoupon);

// // --------------- ADMIN ACCESS --------------- //

// -- Category By Admin -- //
router.delete('/category/:id', authorizationOnlyAdmin, CategoryControllers.deleteCategory);
router.get('/category', authorizationOnlyAdmin, CategoryControllers.getAllCategory);
router.post('/category', authorizationOnlyAdmin, CategoryControllers.addCategory);
router.put('/category/:id', authorizationOnlyAdmin, CategoryControllers.updateCategory);
// -- Products By Admin -- //
router.post('/products', upload.single('image'), authorizationOnlyAdmin, ProductsControllers.addProduct);
router.delete('/products/:id', authorizationOnlyAdmin, ProductsControllers.deleteProducts)
// -- User By Admin -- //
router.get('/user', authorizationOnlyAdmin, UserControllers.getAllUser);
// -- Coupon By Admin -- //
router.post('/coupon', authorizationOnlyAdmin, CouponControllers.addCoupon);
router.delete('/coupon/:id', authorizationOnlyAdmin, CouponControllers.deleteCoupon);

module.exports = router