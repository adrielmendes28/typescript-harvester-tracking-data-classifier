import { Request, Response } from 'express';

import talhoes from '../../static/talhoes.json';

class TalhoesController {
    get(req: Request, res: Response): void {
        res.status(200).json(talhoes);
    };
}

export default new TalhoesController();