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

router.put('/add-user', authMiddleWare.authUser,
    body('projectId').isString().withMessage('ProjectId is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    ProjectController.addUserToProject

)
export default router