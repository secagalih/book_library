import express from 'express';
import { register, logout, login, getUser, getTotalUsers, getAllUsers } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);
router.get('/total-users', authMiddleware, getTotalUsers);
router.get('/get-all-users', authMiddleware, getAllUsers)
export default router;