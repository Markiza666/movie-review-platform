import mongoose, { Schema, Model, Document } from 'mongoose';
import type { IReview } from './Review.ts';
import type { IUser } from './User.ts';

// Interfaces for our Mongoose documents
export interface IMovie extends Document {
    _id: mongoose.Types.ObjectId; // Corrected: Made _id a required property
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    user: IUser['_id'];
    reviews: IReview['_id'][];
}

// Mongoose Schema
const MovieSchema: Schema = new Schema<IMovie>({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
}, {
    timestamps: true,
});

const Movie = mongoose.model<IMovie>('Movie', MovieSchema);

export default Movie;
