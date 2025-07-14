import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import * as authMiddleware from '../middleware/auth.middleware.js'

const router = Router();

router.post("/register",
    body('email').isEmail().withMessage("Email must be a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),

    userController.CreateUserController)

router.post("/login",
    body('email').isEmail().withMessage("Email must be a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),

    userController.loginController)
    
router.get('/profile', 
    authMiddleware.authUser, 
    userController.profileController)
export default router