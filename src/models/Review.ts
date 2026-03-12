import mongoose, { Schema } from 'mongoose';
import { IReview } from '../interfaces/index.ts';

const ReviewSchema: Schema = new Schema<IReview>({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
}, {
    timestamps: true,   // Automatically manage createdAt and updatedAt fields
});

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
