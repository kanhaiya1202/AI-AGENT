import { Router } from "express";
import { body } from "express-validator";
import * as ProjectController from '../controllers/project.controller.js'
import * as authMiddleWare from '../middleware/auth.middleware.js'

const router = Router();

router.post("/create", authMiddleWare.authUser,
    body('name').isString().withMessage('Name is required'),
    ProjectController.createProject

)

router.get("/all" , authMiddleWare.authUser,
    ProjectController.getallProject
)

export default router