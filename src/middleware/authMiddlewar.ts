import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import User from '../models/User.js';
import type { AuthRequest, IUser } from '../interfaces/index.js';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Check if the Authorization header exists and has the 'Bearer' prefix.
  const token = req.headers.authorization?.split(' ')[1];

  // 2. If no token exists, send an error response immediately.
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // 3. If a token exists, proceed to verify it.
  try {
    // 4. Ensure the JWT secret is defined in environment variables.
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not defined' });
    }

    // 5. Verify the token using the secret.
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Find the user based on the decoded token and attach it to the request.
    req.user = await User.findById(decoded.id).select('-password') as IUser;
    
    // 7. Proceed to the next middleware or route handler.
    next();
  } catch (error) {
    // If verification fails, the token is invalid or expired.
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check if the authenticated user has the 'admin' role.
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // If not, deny access.
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};
