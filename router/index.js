const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user');
const ProductsControllers = require('../controllers/products')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authenticateToken, authorizationOnlyAdmin } = require('../middlewares/auth')

router.post('/register', UserControllers.userRegister);
router.post('/login', UserControllers.userLogin);

router.use(authenticateToken);

// -- PRODUCTS -- //
router.get('/products', ProductsControllers.getProducts);
router.get('/products/:id', ProductsControllers.getProductById);

// -- ADMIN ACCESS -- //
router.post('/products', upload.single('image'), authorizationOnlyAdmin, ProductsControllers.addProduct);
router.get('/user', authorizationOnlyAdmin, UserControllers.getAllUser)

module.exports = router;