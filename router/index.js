const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user');
const ProductsControllers = require('../controllers/products');
const GoogleAuthControllers = require('../controllers/authentication')
const CartControllers = require('../controllers/cart');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authenticateToken, authorizationOnlyAdmin } = require('../middlewares/auth');
const CouponControllers = require('../controllers/coupon');

router.post('/register', UserControllers.userRegister);
router.post('/login', UserControllers.userLogin);
router.post('/google', GoogleAuthControllers.authenticationGoogle);

router.use(authenticateToken);

// -- PRODUCTS -- //
router.get('/products', ProductsControllers.getProducts);
router.get('/products/:id', ProductsControllers.getProductById);
// -- CART -- //
router.get('/cart', CartControllers.getCartUserById);
router.post('/products/cart/:id', CartControllers.addCartProducts);
router.delete('/products/cart/:id', CartControllers.deleteProductFromCart);
router.get('/coupon', CouponControllers.getAllCoupon);

// -- ADMIN ACCESS -- //
router.post('/products', upload.single('image'), authorizationOnlyAdmin, ProductsControllers.addProduct);
router.get('/user', authorizationOnlyAdmin, UserControllers.getAllUser);
router.post('/coupon', authorizationOnlyAdmin, CouponControllers.addCoupon);

module.exports = router;