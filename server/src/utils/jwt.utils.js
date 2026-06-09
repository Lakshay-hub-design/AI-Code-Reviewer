import jwt from 'jsonwebtoken'

// Generate a signed JWT for a user
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Verify a JWT and return the decoded payload
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Attach JWT as an httpOnly cookie on the response
export const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,                                      // not accessible via JS
    secure: process.env.NODE_ENV === 'production',       // HTTPS only in prod
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,                   // 7 days in ms
  });
};

// Clear the auth cookie
export const clearTokenCookie = (res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
};