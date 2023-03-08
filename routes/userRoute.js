import express from 'express'
import { allUsers, deleteUserByAdmin, forgetPassword, getUserByAdmin, getUserDetail, updatePassword, updateUserByAdmin, updateUserDetail, userLogin, userLogout, userRegiter } from '../controllers/userController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';
const router = express.Router()

router.route("/register").post(userRegiter)
router.route("/login").post(userLogin)
router.route("/logout").get(userLogout)
router.route("/me").get(isAuthenticated, getUserDetail).put(isAuthenticated, updateUserDetail)
router.route("/forgetpassword").post(forgetPassword)
router.route("/updatepassword").put(isAuthenticated, updatePassword)
router.route("/admin/users").get(isAuthenticated, allUsers)
router.route("/admin/user/:id").get(isAuthenticated, isAuthorized, getUserByAdmin).delete(isAuthenticated, isAuthorized, deleteUserByAdmin).put(isAuthenticated, isAuthorized, updateUserByAdmin)


export default router;