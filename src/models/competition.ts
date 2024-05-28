import { Schema, model } from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { ITeam } from './team';

export interface ICompetition extends Document {
  /** The name of the competition. */
  name: string;
  /** The code of the competition. */
  code: string;
  /** The teams participating in the competition. */
  teams: (ITeam | ObjectId)[];
}

const competitionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  competitionId: { type: String, required: true, unique: true },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});

export const Competition = model('Competition', competitionSchema, 'Competitions');
