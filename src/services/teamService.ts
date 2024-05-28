import axios from 'axios';
import { Team } from '../models/team';
import { importPlayers } from './playerService';
import Bottleneck from 'bottleneck';
import { Types } from 'mongoose';
import { Competition } from '../models/competition';
import { Request } from 'express';

const limiter = new Bottleneck({
  minTime: 7000, 
  maxConcurrent: 1
});

// Function to delay the first call
const delayFirstCall = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};


/**
 * Imports teams from the football data API for a specified competition and adds them to the database.
 * @param competitionId The ID of the competition for which teams will be imported.
 * @param competitionObjectId The ObjectId of the competition document in the database.
 * @returns A promise that resolves when all teams are successfully imported.
 * @throws If an error occurs during the import process.
 */
export const importTeams = async (competitionId: string, competitionObjectId: Types.ObjectId) => {
  try{
    const teamsResponse = await axios.get(`${process.env.FOOTBALL_DATA_URL}/competitions/${competitionId}/teams`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    const teamsData = teamsResponse.data.teams;

    for (const teamData of teamsData) {
      const existingTeam = await Team.findOne({ teamId: teamData.id });

      if (!existingTeam) {
        const team = new Team({
          teamCode: teamData.id,
          name: teamData.name,
          tla: teamData.tla,
          shortName: teamData.shortName,
          crest: teamData.crest,
          website: teamData.website,
          founded: teamData.founded,
          clubColors: teamData.clubColors,
          competitions: [competitionObjectId],
          players: []
        });

        const newTeam = await team.save(); 
        await Competition.findByIdAndUpdate(competitionObjectId, { $push: { teams: newTeam._id } });

        await delayFirstCall(6000); // Initial delay of 6 seconds
        await limiter.schedule(() => importPlayers(teamData.id, newTeam._id));
      
      } else {
        // If team exists, ensure the competition is associated
        await Team.findByIdAndUpdate(existingTeam._id, { $addToSet: { competitions: competitionObjectId } });
      }
    }
  } catch (error: any) {
    console.error('Error importing team:', error.message);
    throw error; 
  }
};

/**
 * Retrieves teams participating in a specified competition from the database.
 * @param competitionCode The code of the competition for which teams will be retrieved.
 * @param filterParams The HTTP request object containing parameters.
 * @returns An array of team documents representing the teams in the specified competition.
 * @throws If the competition with the given code is not found in the database.
 */
export const getTeamsByCompetitionService = async (competitionCode: string, filterParams : Request) => {
  const {
    page = 1, // Default to page 1 if not provided
    limit = 12, // Default to 12 items per page
    name, 
    ...otherParams
  } = filterParams.query;

  const pageNumber: number = typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : 1;
  const limitNumber: number = typeof limit === 'string' ? parseInt(limit, 10) : typeof limit === 'number' ? limit : 12;  

  const matchCondition: any = {};

  if (name) {
      matchCondition.name = { $regex: name, $options: 'i' };
  }

  const competition = await Competition.findOne({ code: competitionCode }).populate({
    path: 'teams',
    match: matchCondition,
    options: { skip: (pageNumber - 1) * limitNumber, limit: limitNumber }
});
  if (!competition) {
    throw new Error(`Competition with code ${competitionCode} not found`);
  }

  return competition.teams;
};

/**
 * Retrieves players in a specified team from the database.
 * @param teamCode The code of the team for which players will be retrieved.
 * @returns An array of team documents representing the players in the specified team.
 * @throws If the team with the given code is not found in the database.
 */
export const getPlayersByTeamService = async (teamCode: string) => {

  const team = await Team.findOne({ tla: teamCode }).populate({
    path: 'players'
});

  if (!team) {
    throw new Error(`Team with tla ${teamCode} not found`);
  }

  return team.players;
};