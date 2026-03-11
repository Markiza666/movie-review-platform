import jwt from 'jsonwebtoken';
import User from '../models/user.ts';
import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { IUser } from '../interfaces/index.ts';

/**
 * Custom Request Interface
 * We extend the standard Express Request to include the 'user' property.
 * This allows us to access req.user in our controllers after authentication.
 */
export interface AuthRequest extends Request {
    user?: IUser;
}

/**
 * Protect Middleware
 * This function verifies the JWT token sent in the Authorization header.
 * If valid, it attaches the user to the request object.
 */
const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    // Check for token in headers (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            // Fetch user from DB without the password and attach to request
            req.user = await User.findById(decoded.id).select('-password') as IUser;

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error('Token Verification Error:', error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

/**
 * Admin Middleware
 * Restricts access to users with the 'admin' role.
 * This is used for creating, updating, and deleting movies.
 */
const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // We check the role property attached by the 'protect' middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Administrative privileges required.');
    }
};

export { protect, admin };
