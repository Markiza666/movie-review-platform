import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import { 
    createMovieReview, 
    deleteReview, 
    getAllReviews, 
    getReviewById, 
    updateReview 
} from '../controllers/reviewController.ts';

const router = express.Router();

// --- PUBLIC ROUTES ---
// Simple one-liners for public access. 
// We separate these to clearly show what data is available to everyone.
router.get('/', getAllReviews);
router.get('/:id', getReviewById);

// --- PRIVATE ROUTES (Login required) ---
// We use router.route() to group multiple actions (POST, PUT, DELETE) 
// targeted at the same path. This follows the DRY (Don't Repeat Yourself) 
// principle and makes the administrative logic easier to manage.

// Note: 'as any' is used here to bypass minor TypeScript compatibility issues 
// between Express request handlers and our custom controller types.
router.route('/')
    .post(protect as any, createMovieReview as unknown as any);

router.route('/:id')
    .put(protect as any, updateReview as unknown as any)
    .delete(protect as any, deleteReview as unknown as any);
    
export default router;
