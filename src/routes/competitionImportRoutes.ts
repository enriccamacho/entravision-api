import { Router } from 'express';
import { importCompetitionData } from '../controllers/competitionController';

const router = Router();

router.post('/:competitionId', importCompetitionData)
export default router;
