import express from 'express';
import { test } from '../Controller/userController.js';

const router = express.Router();

router.get('/', test);

export default router;
