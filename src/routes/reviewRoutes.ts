import express from 'express';
import {
    createMovieReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getReviewById,
    getMovieReviews
} from '../controllers/reviewController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Public routes for reviews
router.route('/').get(getAllReviews);
router.route('/:id').get(getReviewById);
router.route('/movie/:id').get(getMovieReviews);

// Private routes that require a user to be logged in
router.route('/')
    .post(protect as express.RequestHandler, createMovieReview as unknown as express.RequestHandler);

router.route('/:id')
    .put(protect as express.RequestHandler, updateReview as unknown as express.RequestHandler)
    .delete(protect as express.RequestHandler, deleteReview as unknown as express.RequestHandler);
    
export default router;
