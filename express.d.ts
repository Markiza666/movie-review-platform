/**
 * This file is used for "Module Augmentation" in TypeScript.
 * It extends the Express Request interface to include a 'user' object.
 * This allows us to access 'req.user' in our controllers and middleware 
 * without TypeScript throwing an error, since 'user' is not part of the 
 * default Express Request type.
 */

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        role: string;
      };
    }
  }
}

export {}; // This line makes the file a module, which is needed for declare global.
