import type { Request } from 'express';
import mongoose, { Document } from 'mongoose';

// User Interface
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}

// Movie Interface
export interface IMovie extends Document {
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
}

// Review Interface
export interface IReview extends Document {
  movieId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Custom Request Interface for Authentication Middleware
export interface AuthRequest extends Request {
  user?: IUser;
}
