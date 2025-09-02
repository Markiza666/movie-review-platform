import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import type { Response } from 'express';
import type { NextFunction } from 'express';
import User from '../models/User.js';
import type { IUser } from '../models/User.js';

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is not defined in environment variables' });
      }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password') as IUser;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Inte auktoriserad, token misslyckades' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Inte auktoriserad, ingen token' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Endast administratörer har tillgång' });
  }
};
