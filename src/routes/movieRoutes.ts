import express from 'express';
import {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMoviesWithRatings,
} from '../controllers/movieController.ts';
import { getMovieReviews } from '../controllers/reviewController.ts';
import { protect, admin } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Movie-specific routes
router.get('/ratings', getMoviesWithRatings);
router.get('/:id/reviews', getMovieReviews); // GET /api/movies/123/reviews
router.get('/:id', getMovieById);
router.get('/', getMovies);

// Protected routes
router.post('/', protect as any, admin as any, createMovie as any);
router.put('/:id', protect as any, admin as any, updateMovie as any);
router.delete('/:id', protect as any, admin as any, deleteMovie as any);

export default router;
