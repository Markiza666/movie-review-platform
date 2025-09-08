import type { Request, Response } from 'express';
import Review from '../models/Review.ts';
import Movie from '../models/Movie.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';
import mongoose from 'mongoose';

// @desc    Create a new movie review
// @route   POST /api/reviews
// @access  Private
export const createMovieReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: 'Not authorized, user missing from request.' });
            return;
        }
        
        const { rating, comment, movieId } = req.body;
        const userId = req.user._id;

        if (!rating || !comment || !movieId) {
            res.status(400).json({ message: 'Please provide a rating, comment, and movie ID.' });
            return;
        }

        // Validera att movieId är ett giltigt ObjectId
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            res.status(400).json({ message: 'Invalid movie ID.' });
            return;
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            res.status(404).json({ message: 'Movie not found.' });
            return;
        }

        const existingReview = await Review.findOne({ movie: movieId, user: userId });
        if (existingReview) {
            res.status(400).json({ message: 'You have already reviewed this movie.' });
            return;
        }

        const review = await Review.create({
            rating,
            comment,
            user: userId,
            movie: movieId,
        });

        movie.reviews.push(review._id);
        await movie.save();

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Get all reviews for a specific movie
// @route   GET /api/reviews/movie/:id
// @access  Public
export const getMovieReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        // Använd .populate() för att hämta användardata
        const reviews = await Review.find({ movie: req.params.id }).populate('user', 'username');
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Get a single review by ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
        // Använd .populate() för att hämta användardata
        const review = await Review.findById(req.params.id).populate('user', 'username');
        if (!review) {
            res.status(404).json({ message: 'Review not found.' });
            return;
        }
        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        // Använd .populate() för att hämta både film- och användardata
        const reviews = await Review.find().populate('movie', 'title').populate('user', 'username');
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Update an existing movie review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ message: 'Review not found.' });
            return;
        }
        
        // We ensure req.user exists before proceeding
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: 'Not authorized, user missing from request.' });
            return;
        }

        // Check if the authenticated user is the owner of the review
        if (review.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized to update this review.' });
            return;
        }

        const { rating, comment } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, comment },
            { new: true }
        );

        res.status(200).json(updatedReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Delete a movie review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ message: 'Review not found.' });
            return;
        }
        
        // We ensure req.user exists before proceeding
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: 'Not authorized, user missing from request.' });
            return;
        }

        // Check if the authenticated user is the owner of the review
        if (review.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized to delete this review.' });
            return;
        }

        // Remove the review reference from the movie
        await Movie.findByIdAndUpdate(review.movie, { $pull: { reviews: review._id } });

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review removed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
