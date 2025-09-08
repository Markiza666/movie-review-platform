import express from 'express';
import {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMoviesWithRatings,
    getUniqueGenres,
    getMoviesByGenre,
} from '../controllers/movieController.ts';
import { protect, admin } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Public routes for movies
router.route('/ratings').get(getMoviesWithRatings);
router.route('/genres').get(getUniqueGenres);
router.route('/genre/:genre').get(getMoviesByGenre);
router.route('/:id').get(getMovieById);
router.route('/').get(getMovies);

// Admin routes (requires logged-in user with admin privileges)
router.post('/', protect as express.RequestHandler, admin as express.RequestHandler, createMovie as unknown as express.RequestHandler);
router.put('/:id', protect as express.RequestHandler, admin as express.RequestHandler, updateMovie as unknown as express.RequestHandler);
router.delete('/:id', protect as express.RequestHandler, admin as express.RequestHandler, deleteMovie as unknown as express.RequestHandler);

export default router;
