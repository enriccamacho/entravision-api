import { Request, Response } from 'express';
import { importCompetition, getCompetitionsService } from '../services/competitionService';

/**
 * Imports data for a competition based on the provided competition ID.
 * 
 * @param req The HTTP request object containing parameters.
 * @param res The HTTP response object for sending responses.
 * @returns A JSON response indicating success or failure.
 */
export const importCompetitionData = async (req: Request, res: Response) => {
  const { competitionId } = req.params;

  try {
    await importCompetition(competitionId);
    res.status(200).json({ message: 'Competition data imported successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to import competition data', error: error.message });
  }
};


/**
 * Retrieves competitions .
 * 
 * @param req The HTTP request object containing parameters.
 * @param res The HTTP response object for sending responses.
 * @returns A JSON response containing competitions data or an error message.
 */
export const getCompetitions = async (req: Request, res: Response) => {

  try {
    const competitions = await getCompetitionsService();
    res.status(200).json(competitions);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve competitions', error: error.message });
  }
};
