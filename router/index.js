const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user');
const ProductsControllers = require('../controllers/products');
const AuthControllers = require('../controllers/authentication')
const CartControllers = require('../controllers/cart');
const CategoryControllers = require('../controllers/category');
const PaymentControllers = require('../controllers/payment')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authenticateToken, authorizationOnlyAdmin } = require('../middlewares/auth');
const CouponControllers = require('../controllers/coupon');
const TransactionControllers = require('../controllers/transaction');
const BiodataControllers = require('../controllers/biodata');
const ChatControllers = require('../controllers/chat');
const SizeControllers = require('../controllers/size');

// -- ROOT -- //

router.post('/register', UserControllers.userRegister);
router.post('/login', UserControllers.userLogin);
router.post('/google', AuthControllers.authenticationGoogle);
router.post('/facebook', AuthControllers.authenticationFacebook);

router.use(authenticateToken);

// -- TRANSACTIONS -- //
router.delete('/transaction/:id', TransactionControllers.deleteTransaction)
router.get('/transaction/:id', TransactionControllers.getTransactionItemDetails);
router.post('/transaction', TransactionControllers.addTransaction);
router.get('/transaction', TransactionControllers.getAllTransaction);

// -- SIZE -- //
router.get('/size', SizeControllers.getSize);

// -- BIODATA -- //
router.post('/biodata', BiodataControllers.addBiodata)
router.get('/biodata', BiodataControllers.getMyBiodata)

// -- PRODUCTS -- //
router.get('/products/:id', ProductsControllers.getProductById);
router.get('/products', ProductsControllers.getProducts);

// -- CHAT -- //
router.post('/chat/:receiverId', ChatControllers.addChat);
router.delete('/chat/:chatId', ChatControllers.deleteChatId);

// -- CARTS -- //
router.get('/cart', CartControllers.getCartUserById);
router.post('/cart', CartControllers.addCartProducts);
router.delete('/cart/:productId', CartControllers.reduceProductFromCart);

// -- COUPON -- //
router.get('/coupon', CouponControllers.getAllCoupon);

// -- PAYMENT BY MIDTRANS -- //
router.get('/payment/:transactionId', PaymentControllers.PaymentMidtrans)

// // --------------- ADMIN ACCESS --------------- //

// -- Category By Admin -- //
router.delete('/category/:id', authorizationOnlyAdmin, CategoryControllers.deleteCategory);
router.get('/category', authorizationOnlyAdmin, CategoryControllers.getAllCategory);
router.post('/category', authorizationOnlyAdmin, CategoryControllers.addCategory);
router.put('/category/:id', authorizationOnlyAdmin, CategoryControllers.updateCategory);

// -- Products By Admin -- //
router.post('/products', upload.single('image'), authorizationOnlyAdmin, ProductsControllers.addProduct);
router.delete('/products/:id', authorizationOnlyAdmin, ProductsControllers.deleteProducts)

// -- Size By Admin -- //
router.post('/size', authorizationOnlyAdmin, SizeControllers.addSize);
router.delete('/size/:id', authorizationOnlyAdmin, SizeControllers.deleteSize);

// -- User By Admin -- //
router.get('/user', authorizationOnlyAdmin, UserControllers.getAllUser);
router.get('/user/:id', authorizationOnlyAdmin, UserControllers.getUserById);
router.post('/user', authorizationOnlyAdmin, UserControllers.addUser);
router.put('/user/:id', authorizationOnlyAdmin, UserControllers.updateUser);
router.delete('/user/:id', authorizationOnlyAdmin, UserControllers.deleteUserById);

// -- Coupon By Admin -- //
router.post('/coupon', authorizationOnlyAdmin, CouponControllers.addCoupon);
router.delete('/coupon/:id', authorizationOnlyAdmin, CouponControllers.deleteCoupon);

module.exports = router