import { Router } from 'express';
import TalhoesController from '../controllers/TalhoesController';

const router = Router();

router.get('/talhoes', TalhoesController.get);

export default router;
