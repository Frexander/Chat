import express from 'express'
import { login,logout, signup } from '../controllers/auth.controller.js';

const router = express.Router();


// http://localhost:3000/api/auth/signup
router.post("/signup", signup);
// api/auth/login
router.post("/login", login);
// api/auth/logout
router.post("/logout", logout);



export default router;