import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Here you would typically:
        // 1. Check if user exists in your database
        // 2. Create user if they don't exist
        // 3. Generate JWT token
        // For now, we'll just return the profile
        return done(null, profile);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Configure JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-jwt-secret',
    },
    async (payload, done) => {
      try {
        // Here you would typically:
        // 1. Verify the user still exists
        // 2. Check if their permissions are still valid
        // For now, we'll just return the payload
        return done(null, payload);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Middleware to ensure user is authenticated
export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check if user has required role
export const hasRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// Initialize passport
export const initializePassport = () => {
  return passport.initialize();
}; 