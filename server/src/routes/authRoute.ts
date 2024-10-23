import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router()

// register route
router.post('/register', register)
// login route
router.post('/login', login)
// refresh token route
router.post('/refresh-token', refreshToken)
// logout route
router.post('/logout', logout)

// check user auth on page load
router.get('/check', authMiddleware, (_req, res) => {
    res.status(200).json({ success: true });
});

export default router