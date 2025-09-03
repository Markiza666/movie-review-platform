import express from 'express';
import { createReview, deleteReview, getMovieReviews, updateReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public route to get all reviews for a specific movie
router.get('/:movieId', getMovieReviews);

// Protected routes to manage reviews
// All of these actions require a valid token
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
