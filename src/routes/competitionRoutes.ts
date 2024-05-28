import { Router } from 'express';
import { getCompetitions } from '../controllers/competitionController';

const router = Router();

router.get('', getCompetitions)
export default router;
