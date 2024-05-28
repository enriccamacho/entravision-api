import { Request, Response } from 'express';
import { getPlayersByCompetitionService } from '../services/playerService';

/**
 * Retrieves players for a given competition code, optionally filtered by team TLA.
 * 
 * @param req The HTTP request object containing parameters.
 * @param res The HTTP response object for sending responses.
 * @returns A JSON response containing players data or an error message.
 */
export const getPlayersByCompetition = async (req: Request, res: Response) => {
  const { competitionCode, teamTla } = req.params;

  if (!competitionCode) {
    return res.status(400).json({ message: 'Competition code is required' });
  }

  try {
    const players = await getPlayersByCompetitionService(competitionCode, req, teamTla as string );
    res.status(200).json(players);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve players', error: error.message });
  }
};