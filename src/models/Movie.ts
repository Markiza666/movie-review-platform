import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: String, required: true },
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
