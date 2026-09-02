import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // this allows cookies to be sent
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { attachUser } from './utils/attachUser.js';

app.use(attachUser);

import shortUrl from './routes/shortUrl.route.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/create', shortUrl);

import { redirectFromShortUrl } from './controller/shortUrl.controller.js';

app.get('/:id', redirectFromShortUrl);

import APIResponse from './utils/APIResponse.js';

// global error handler for synchronous errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res
    .status(statusCode)
    .json(
      new APIResponse(
        statusCode,
        err.errors || [],
        err.message || 'internal server error',
      ),
    );
});

export default app;
