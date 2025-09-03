import { Router } from 'express';
import {
    getMovieReviews,
    createReview,
    updateReview,
    deleteReview,
} from '../controllers/reviewController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

// @desc    Get all reviews for a movie
// @route   GET /api/reviews/movies/:movieId
router.get('/movies/:movieId', getMovieReviews);    // This route is public, no 'protect' middleware needed

// @desc    Create a new review
// @route   POST /api/reviews/:movieId
router.post('/:movieId', protect, createReview);    // This route is private, hence 'protect' middleware is used

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
router.put('/:reviewId', protect, updateReview);    // This route is private, the same as above

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
router.delete('/:reviewId', protect, deleteReview); // This route is private, the same as above

export default router;
