import type { Request, Response } from 'express';
import type { IReview } from '../models/Review.ts';
import mongoose, { Schema, Document } from 'mongoose';
import type { IUser } from '../models/User.ts';
import Movie from '../models/Movie.ts';
import Review from '../models/Review.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';


export interface IMovie extends Document {
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    user: IUser['_id'];
    reviews: IReview['_id'][];
}

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private
export const createMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // We ensure req.user exists before proceeding
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: 'Not authorized, user missing from request.' });
            return;
        }

        const { title, director, releaseYear, genre } = req.body;
        const userId = req.user._id;

        if (!title || !director || !releaseYear || !genre) {
            res.status(400).json({ message: 'Please add all fields.' });
            return;
        }

        const movie = await Movie.create({
            title,
            director,
            releaseYear,
            genre,
            user: userId
        });

        res.status(201).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const movies = await Movie.find({}).populate('reviews');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
        const movie = await Movie.findById(req.params.id).populate('reviews');
        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private
export const updateMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // We ensure req.user exists before proceeding
        if (!req.user || !req.user.isAdmin) {
            res.status(401).json({ message: 'Not authorized, user not authenticated or not an admin.' });
            return;
        }
        
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }

        const { title, director, releaseYear, genre } = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, director, releaseYear, genre },
            { new: true }
        );

        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private
export const deleteMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // We ensure req.user exists before proceeding
        if (!req.user || !req.user.isAdmin) {
            res.status(401).json({ message: 'Not authorized, user not authenticated or not an admin.' });
            return;
        }
        
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }

        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Movie removed.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all movies with their average rating
// @route   GET /api/movies/ratings
// @access  Public
export const getMoviesWithRatings = async (req: Request, res: Response): Promise<void> => {
    try {
        const moviesWithRatings = await Movie.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'reviews',
                    foreignField: '_id',
                    as: 'movieReviews',
                },
            },
            {
                $addFields: {
                    averageRating: { $avg: '$movieReviews.rating' }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    director: 1,
                    releaseYear: 1,
                    genre: 1,
                    averageRating: 1
                },
            },
        ]);
        res.status(200).json(moviesWithRatings);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Get all unique genres
// @route   GET /api/movies/genres
// @access  Public
export const getUniqueGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const genres = await Movie.distinct('genre');
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genre
// @access  Public
export const getMoviesByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const movies = await Movie.find({ genre: req.params.genre });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};
