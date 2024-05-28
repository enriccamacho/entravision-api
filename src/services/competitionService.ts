import axios from 'axios';
import { Competition, ICompetition } from '../models/competition';
import { importTeams } from './teamService';

/**
 * Imports competition data from the football data API and saves it to the database.
 * If the competition with the given code already exists in the database, it logs a message and does nothing.
 * @param competitionCode The code of the competition to import.
 * @returns A promise that resolves when the competition data is successfully imported.
 * @throws If an error occurs during the import process.
 */
export const importCompetition = async (competitionCode: string) => {
  try {
    const existingCompetition = await Competition.findOne({ code: competitionCode });

    if (!existingCompetition) {
  
      const competitionResponse = await axios.get(`${process.env.FOOTBALL_DATA_URL}/competitions/${competitionCode}`, {
        headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
      });
      const competitionData = competitionResponse.data;

      const competition = new Competition({
        name: competitionData.name,
        code: competitionData.code,
        competitionId: competitionData.id,
        teams: []
      });

      const newCompetition = await competition.save();
      await importTeams(competitionData.id, newCompetition._id);

    }else{
      console.log("Competition already imported")
    }
  } catch (error: any) {
    console.error('Error importing competition:', error.message);
    throw error; 
  }
};

/**
 * Retrieves competitions.
 * @returns An array of competition documents.
 * @throws If there is an error.
 */
export const getCompetitionsService = async () => {
    const competitions: ICompetition[] = await Competition.find() as ICompetition[]

  return competitions;
};

