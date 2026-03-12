import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.ts';
import {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    getMoviesWithRatings,
} from '../controllers/movieController.ts';
import { getMovieReviews } from '../controllers/reviewController.ts';

const router = express.Router();

// Simple one-liners for public and specific access. 
// We separate these to clearly show what data is available to everyone.
// --- MOVIE-SPECIFIC ROTES ---
router.get('/ratings', getMoviesWithRatings);
router.get('/:id/reviews', getMovieReviews); // GET /api/movies/123/reviews

// --- PUBLIC ROUTES ---
router.get('/', getMovies);
router.get('/:id', getMovieById);

// --- ADMIN ROUTES ---
// We use router.route() to group multiple actions (POST, PUT, DELETE) 
// targeted at the same path. This follows the DRY (Don't Repeat Yourself) 
// principle and makes the administrative logic easier to manage.

// Note: 'as any' is used here to bypass minor TypeScript compatibility issues 
// between Express request handlers and our custom controller types.
router.route('/')
    .post(protect as any, admin as any, createMovie as any);

router.route('/:id')
    .put(protect as any, admin as any, updateMovie as any)
    .delete(protect as any, admin as any, deleteMovie as any);

export default router;
