import mongoose, { Schema, Document } from "mongoose";
import type { IMovie } from "./Movie.ts";
import type { IUser } from "./User.ts";

// Interfaces for our Mongoose documents
export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    user: IUser['_id'];
    movie: IMovie['_id'];
}

// Mongoose Schema
const ReviewSchema: Schema = new Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
}, {
    timestamps: true,
});

const Review = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
