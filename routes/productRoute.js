import express from 'express'
import { addProduct, addProductReview, deleteProduct, deleteProReview, getAllProducts, getAllProReview, getSingleProduct, updateProduct } from '../controllers/productContoller.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';
const router = express.Router()

//Public Routes
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getSingleProduct)

//Admin Routes
router.route('/admin/product/add').post(isAuthenticated, isAuthorized, addProduct)
router.route('/admin/product/:id').put(isAuthenticated, isAuthorized, updateProduct)
    .delete(isAuthenticated, isAuthorized, deleteProduct)

//Rating
router.route("/review").put(isAuthenticated, addProductReview)
router.route("/reviews").get(getAllProReview).delete(isAuthenticated,isAuthorized,deleteProReview)


export default router;
