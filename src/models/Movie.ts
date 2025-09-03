import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IMovie extends Document {
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
}

const MovieSchema = new Schema<IMovie>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    director: {
        type: String,
        required: true,
        trim: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
});

const Movie: Model<IMovie> = mongoose.model<IMovie>('Movie', MovieSchema);

export default Movie;
