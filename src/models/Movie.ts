import mongoose, { Schema } from 'mongoose';
import type { IMovie } from '../interfaces/index.js';

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: String, required: true },
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
