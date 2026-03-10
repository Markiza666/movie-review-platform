import jwt from 'jsonwebtoken';
import User from '../models/user.ts';
import type { Request, Response, NextFunction } from 'express';
import * as asyncHandler from 'express-async-handler';
import { IUser } from '../interfaces/index.ts';

// Extend the Express Request type to include the user property
// Note: 'user' is optional here to prevent type errors in the middleware itself
export interface AuthRequest extends Request {
    user?: IUser;
}

const protect = asyncHandler.default(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

            // Get user from the token and attach to the request object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin. This action requires administrative privileges.');
    }
};

export { protect, admin };
