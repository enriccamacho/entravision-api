import { Router } from 'express';
import { getPlayersByTeam, getTeamsByCompetition } from '../controllers/teamController';

const router = Router();

router.get('/:competitionCode', getTeamsByCompetition)
    .get('/:teamCode/players', getPlayersByTeam);

export default router;
