import { Request, Response } from 'express';
import DataPointService from '../services/DataPointService';

class DataPointController {
    async getLastDataPoints(req: Request, res: Response) {
        const { frota, frente, startDate, endDate } = req.query as {
            frota?: string;
            frente?: string;
            startDate?: string;
            endDate?: string;
        };

        try {
            const dataPoints = await DataPointService.getLastDataPoints(frota, frente, startDate, endDate);
            res.json(dataPoints);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEquipmentTrails(req: Request, res: Response) {
        const { frota, frente, startDate, endDate } = req.query as {
            frota?: string;
            frente?: string;
            startDate?: string;
            endDate?: string;
        };

        try {
            const trails = await DataPointService.getEquipmentTrails(frota, frente, startDate, endDate);
            res.json(trails);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEquipmentSummary(req: Request, res: Response) {
        try {
            const equipmentSummary = await DataPointService.filterEquipmentSummaryByFrota();
            res.json(equipmentSummary);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new DataPointController();