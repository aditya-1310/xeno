import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ensureAuth } from '../middleware/auth';

const router = Router();

// Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user as any;
      
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.emails[0].value,
          name: user.displayName,
        },
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '24h' }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error`);
    }
  }
);

// Get current user
router.get('/me', ensureAuth, (req, res) => {
  res.json(req.user);
});

// Logout
router.post('/logout', ensureAuth, (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client should remove the token
  res.json({ message: 'Logged out successfully' });
});

export default router; 