import mongoose, { Schema } from 'mongoose';
import { IMovie } from '../interfaces/index.ts';

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
