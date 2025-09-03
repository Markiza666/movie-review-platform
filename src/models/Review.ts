import mongoose, { Schema } from 'mongoose';
import type { IReview } from '../interfaces/index.ts';

const ReviewSchema: Schema = new Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date, default: Date.now
    },
});

export default mongoose.model<IReview>('Review', ReviewSchema);
