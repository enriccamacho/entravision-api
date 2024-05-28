import { Schema, model } from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { IPlayer } from './player';
import { ICompetition } from './competition';

export interface ITeam extends Document {
  /** The name of the team. */
  name: string;
  /** The three-letter acronym of the team. */
  tla: string;
  /** The short name or nickname of the team. */
  shortName: string;
  /** The URL of the team's crest or logo. */
  crest: string;
  /** The code assigned to the team. */
  teamCode: string;
  /** The website of the team. */
  website: string;
  /** The foundation year of team. */
  founded: string;
  /** The colors assigned to the team. */
  clubColors: Number;
  /** The competitions in which the team participates. */
  competitions: (ICompetition | ObjectId)[];
  /** The players belonging to the team. */
  players: (IPlayer | ObjectId)[];
}

const teamSchema = new Schema({
  name: { type: String, required: true },
  tla: { type: String, required: true },
  shortName: { type: String },
  crest: { type: String },
  teamCode: { type: String, required: true },
  website: { type: String },
  founded: { type: Number },
  clubColors: { type: String },
  competitions: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]

  
});

export const Team = model('Team', teamSchema, 'Teams');
