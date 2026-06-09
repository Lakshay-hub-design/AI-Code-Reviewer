import passport from 'passport';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.utils.js';

export const githubLogin = passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
})

export const githubCallback = (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user) => {
    if (err || !user) {
      console.error('GitHub OAuth error:', err);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
 
    // Issue JWT and store in httpOnly cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);
 
    // Redirect to the editor dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  })(req, res, next);
};

export const logout = (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = (req, res) => {
  // req.user is attached by protect middleware
  res.status(200).json({ user: req.user.toPublicJSON() });
};