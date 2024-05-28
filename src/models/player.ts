import { Schema, model } from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { ITeam } from './team';

export interface IPlayer extends Document {
  /** The unique identifier of the player. */
  playerId: string;
  /** The name of the player. */
  name: string;
  /** The position or role of the player in the team. */
  position: string;
  /** The date of birth of the player. */
  dateOfBirth: Date;
  /** The nationality of the player. */
  nationality: string;
  /** The shirt number of the player. */
  shirtNumber: Number;
  /** The section of the player. */
  section: string;
  /** The ID of the team/s to which the player belongs. */
  teams: (ITeam | ObjectId)[];

}

const playerSchema = new Schema({
  playerId: { type: String, required: true , unique: true  },
  name: { type: String, required: true },
  position: { type: String },
  dateOfBirth: { type: Date },
  nationality: { type: String },
  shirtNumber: { type: Number },
  section: { type: String },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});

export const Player = model('Player', playerSchema, 'Players');
