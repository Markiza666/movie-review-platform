import { Router } from 'express';
import {
    getUniqueGenres,
    getMoviesByGenre,
} from '../controllers/genreController.ts';

const router = Router();

// @desc    Get all unique genres from movies
// @route   GET /api/genres
// @access  Public
router.get('/', getUniqueGenres);

// @desc    Get movies by genre
// @route   GET /api/genres/:genre
// @access  Public
router.get('/:genre', getMoviesByGenre);

export default router;
