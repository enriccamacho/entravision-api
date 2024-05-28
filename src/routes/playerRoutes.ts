import { Router } from 'express';
import { getPlayersByCompetition } from '../controllers/playerController';

const router = Router();

router.get('/:competitionCode/:teamTla?', getPlayersByCompetition)

export default router;
