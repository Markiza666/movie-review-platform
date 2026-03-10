import mongoose, { Document } from 'mongoose';

// --- USER INTERFACE ---
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// --- MOVIE INTERFACE ---
export interface IMovie extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    director: string;
    releaseYear: number;
    user: mongoose.Types.ObjectId | IUser; 
    reviews: mongoose.Types.ObjectId[] | IReview[];
    createdAt: Date;
    updatedAt: Date;
}

// --- REVIEW INTERFACE ---
export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    userId: mongoose.Types.ObjectId | IUser;
    movieId: mongoose.Types.ObjectId | IMovie;
    createdAt: Date;
    updatedAt: Date;
}
