import { Router } from 'express';
import DataPointRoutes from './DataPointRoutes';
import TalhoesRoutes from './TalhoesRoutes'

const router = Router();

router.use(DataPointRoutes);
router.use(TalhoesRoutes);

export default router;