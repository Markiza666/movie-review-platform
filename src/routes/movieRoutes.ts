import express from 'express';
import { getMovies, getMovieById, updateMovie, deleteMovie, getMoviesWithRatings, createMovie } from '../controllers/movieController.ts';
import { protect, admin } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Public routes
router.get('/', getMovies);
router.get('/:id', getMovieById);
router.get('/ratings', getMoviesWithRatings);

// Admin-only routes
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;