import type { Request, Response } from 'express';
import Movie from '../models/movie.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';
import Review from '../models/review.ts';

export const createMovie = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const { title, director, releaseYear, genre } = req.body;
        const movie = await Movie.create({
            title,
            director,
            releaseYear,
            genre,
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

        // OWNERSHIP CHECK: Only the admin who created the movie can update it
        if (movie.user.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'User not authorized to update this movie. Only the owner can perform this action.' });
            return;
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
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }

        // OWNERSHIP CHECK: Only the admin who created the movie can delete it
        if (movie.user.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'User not authorized to delete this movie.' });
            return;
        }

        await Review.deleteMany({ movieId: req.params.id });
        await Movie.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Movie and its reviews removed.' });
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
        console.log("Starting aggregation...");

        const moviesWithRatings = await Movie.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'movieId',
                    as: 'movieReviews',
                },
            },
            {
                $addFields: {
                    averageRating: { $ifNull: [{ $avg: '$movieReviews.rating' }, 0] }
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

        console.log("Aggregation successful, found:", moviesWithRatings.length);
        res.status(200).json(moviesWithRatings);
    } catch (error: any) {
        // Log full error details to the terminal for server-side debugging
        console.error('--- AGGREGATION ERROR DETAILS ---');
        console.error(error.message);
        console.error(error);
        console.error('---------------------------------');
        +
        // Return the error message in the response for easier client-side testing (temporary)
        res.status(500).json({ 
            message: 'Server error during rating aggregation.',
            error: error.message
        });
    }
};
