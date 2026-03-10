import type { Request, Response } from 'express';
import { IMovie } from '../interfaces/index.ts';
import Movie from '../models/movie.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';

export const createMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const { title, director, releaseYear } = req.body;
        const movie = await Movie.create({
            title,
            director,
            releaseYear,
            user: req.user._id
        });

        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const movies = await Movie.find({}).populate('reviews');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }

        // Only admin can update movies
        if (req.user?.role !== 'admin') {
            res.status(404).json({ message: 'Only admins can update movies.' });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Only admins can delete movies.' });
            return;
        }

        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }

        res.status(200).json({ message: 'Movie removed.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

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
                    averageRating: 1
                },
            },
        ]);
        res.status(200).json(moviesWithRatings);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};
