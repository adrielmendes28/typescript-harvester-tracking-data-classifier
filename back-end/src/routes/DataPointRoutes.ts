import { Router } from 'express';
import DataPointController from '../controllers/DataPointController';

const router = Router();

router.get('/last-point', DataPointController.getLastDataPoints);
router.get('/trails', DataPointController.getEquipmentTrails);
router.get('/equipment-summary', DataPointController.getEquipmentSummary);

export default router;
