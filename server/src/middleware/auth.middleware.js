import { verifyToken } from '../utils/jwt.utils.js';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    // Verify signature & expiry
    const decoded = verifyToken(token);

    // Attach user to request (excluding sensitive fields)
    const user = await User.findById(decoded.id).select('-__v');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

export default protect;