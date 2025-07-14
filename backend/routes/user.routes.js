import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";

const router = Router();

router.post("/register",
    body('email').isEmail().withMessage("Email must be a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),

    userController.CreateUserController)

export default router