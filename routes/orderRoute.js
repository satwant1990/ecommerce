import express from 'express'
import { deleteOrder, getAllOrder, getMyOrder, getSingleOrder, newOrder, updateOrder } from '../controllers/orderController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';
const router = express.Router()

router.route("/order/create").post(isAuthenticated, newOrder)
router.route("/admin/order/:id").get(isAuthenticated, isAuthorized, getSingleOrder)
.delete(isAuthenticated, isAuthorized, deleteOrder)
.put(isAuthenticated, isAuthorized, updateOrder)
router.route("/my-orders").get(isAuthenticated, getMyOrder)
router.route("/admin/orders").get(isAuthenticated, isAuthorized, getAllOrder)

export default router;