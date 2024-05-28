
import { Request, Response } from 'express';
import { getPlayersByTeamService, getTeamsByCompetitionService } from '../services/teamService';

/**
 * Retrieves teams participating in a given competition.
 * 
 * @param req The HTTP request object containing parameters.
 * @param res The HTTP response object for sending responses.
 * @returns A JSON response containing teams or an error message.
 */
export const getTeamsByCompetition = async (req: Request, res: Response) => {
    const { competitionCode } = req.params;
  
    try {
      const teams = await getTeamsByCompetitionService(competitionCode, req);
      res.status(200).json(teams);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve teams', error: error.message });
    }
  };
  /**
   * Retrieves players from a given team.
   * 
   * @param req The HTTP request object containing parameters.
   * @param res The HTTP response object for sending responses.
   * @returns A JSON response containing players or an error message.
   */
  export const getPlayersByTeam = async (req: Request, res: Response) => {
      const { teamCode } = req.params;
    
      try {
        const players = await getPlayersByTeamService(teamCode);
        res.status(200).json(players);
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve players', error: error.message });
      }
    };