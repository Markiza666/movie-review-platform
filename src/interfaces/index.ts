import type { Request } from 'express';
import { ObjectId } from 'mongoose';

// Interface for the User model
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  isAdmin?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for the Movie model
export interface IMovie {
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  user: IUser['_id'];
}

// Interface for the Review model
export interface IReview {
  movieId: ObjectId;
  userId: ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Custom Request type to include user data from middleware
export interface AuthRequest extends Request {
  user: IUser;
}
