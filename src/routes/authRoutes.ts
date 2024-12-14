import express from 'express';
// import { registerUser, loginUser } from '../controllers/authController';    // uncomment this for mongodb version
import { registerUser, loginUser } from '../controllers/authControllerFilesv';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
