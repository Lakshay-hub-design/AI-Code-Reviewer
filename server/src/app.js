import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import configurePassport from './config/passport.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';


import authRoutes from './routes/auth.routes.js'
import sessionRoutes from './routes/session.routes.js'

import passport from 'passport';

const app = express();

configurePassport()
app.use(passport.initialize())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '2mb'}));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/session', sessionRoutes)


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound)
app.use(errorHandler)

export default app;