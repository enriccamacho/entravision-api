import axios from 'axios';
import { Player, IPlayer } from '../models/player';
import { Types } from 'mongoose';
import { Team, ITeam } from '../models/team';
import { Competition, ICompetition } from '../models/competition';
import Bottleneck from 'bottleneck';
import { Request } from 'express';

/**
 * Imports players from the football data API for a specified team and adds them to the database.
 * @param teamCode The code of the team for which players will be imported.
 * @param teamId The ID of the team document in the database.
 * @returns A promise that resolves when all players are successfully imported.
 * @throws If an error occurs during the import process.
 */
interface PopulatedCompetition extends ICompetition {
  teams: (ITeam & { players: IPlayer[] })[];
}


const limiter = new Bottleneck({
  minTime: 7000, 
  maxConcurrent: 1
});

// Function to delay the first call
const delayFirstCall = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};


export const importPlayers = async (teamCode: Number, teamId: Types.ObjectId) => {
  try{
    const playersResponse = await axios.get(`${process.env.FOOTBALL_DATA_URL}/teams/${teamCode}`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    const playersData = playersResponse.data.squad;


    for (let playerData of playersData) {
      const existingPlayer = await Player.findOne({ playerId: playerData.id });
      if(!existingPlayer){
        await delayFirstCall(6000); // Initial delay of 6 seconds

        const personsResponse = await limiter.schedule(() =>  axios.get(`${process.env.FOOTBALL_DATA_URL}/persons/${playerData.id}`, {
          headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
        }) )as any
        const playersDetails = personsResponse.data
        if(playersDetails){
          playerData = 
          {
            ...playerData,
            section: playersDetails.section,
            shirtNumber: playersDetails.shirtNumber
          }
        }

      const player = new Player({
        playerId: playerData.id,
        name: playerData.name,
        section: playerData.section,
        position: playerData.position,
        dateOfBirth: playerData.dateOfBirth,
        nationality: playerData.nationality,
        shirtNumber: playerData.shirtNumber,
        teams: [teamId]
      });

      const newPlayer = await player.save();
      await Team.findByIdAndUpdate(teamId, { $push: { players: newPlayer._id } });
      } else {
        await Player.findByIdAndUpdate(existingPlayer._id, { $addToSet: { teams: teamId } });
        await Team.findByIdAndUpdate(teamId, { $push: { players: existingPlayer._id } });
      }


    }
  } catch (error: any) {
    console.error('Error importing player:', error.message);
    throw error; 
  }
};

/**
 * Retrieves players belonging to teams participating in a specified competition.
 * @param competitionCode The code of the competition for which players will be retrieved.
 * @param filterParams The HTTP request object containing parameters.
 * @param teamTla Optional. The team TLA (Three-Letter Abbreviation) to filter players by team.
 * @returns An array of player documents representing the players in the specified competition.
 * @throws If the competition with the given code is not found in the database.
 */
export const getPlayersByCompetitionService = async (competitionCode: string, filterParams : Request, teamTla?: string) => {
  const {
    page = 1, // Default to page 1 if not provided
    limit = 12, // Default to 12 items per page
    ...otherParams
  } = filterParams.query;

  if(teamTla){
    const team: ITeam = await Team.findOne({ tla: teamTla }) as ITeam
    if(!team){
      throw new Error(`Team with tla ${teamTla} not found`);
    }
  }

  const populateOptions = teamTla ? {
    path: 'teams',
    match: { tla: teamTla },
    populate: { path: 'players' }
  } : {
    path: 'teams',
    populate: { path: 'players' }
  };

  const competition = await Competition.findOne({ code: competitionCode }).populate(populateOptions) as unknown as PopulatedCompetition

  if (!competition) {
    throw new Error(`Competition with code ${competitionCode} not found`);
  }

  const pageNumber: number = typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : 1;
  const limitNumber: number = typeof limit === 'string' ? parseInt(limit, 10) : typeof limit === 'number' ? limit : 12;    
  const startIndex = (pageNumber - 1) * limitNumber;

  const players = competition.teams.flatMap(team => team.players).slice(startIndex, startIndex + limitNumber);
  return players;
};
