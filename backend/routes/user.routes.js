import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import bodyParser from "body-parser";

const router = Router();

router.post("/register",
    body('email').isEmail().withMessage("Email must be a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),

    userController.CreateUserController)

router.post("/login",
    body('email').isEmail().withMessage("Email must be a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),
    
    userController.loginController)
export default router