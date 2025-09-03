import Movie from '../models/Movie.ts';
import type { Request, Response } from 'express';

// @desc    Get all unique genres from movies
// @route   GET /api/genres
// @access  Public
export const getUniqueGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const genres = await Movie.distinct('genre');
        res.status(200).json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get movies by genre
// @route   GET /api/genres/:genre
// @access  Public
export const getMoviesByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const movies = await Movie.find({ genre: req.params.genre });
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
