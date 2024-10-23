import { Router } from "express";
import { getUser } from "../controllers/userController";

const router = Router()

// get user route
router.get('/', getUser)

export default router