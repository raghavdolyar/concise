import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';

import Url from './models/url.model.js';

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
import user_routes from './routes/user.routes.js';
import auth_routes from './routes/auth.routes.js';

app.use('/api/user', user_routes);
app.use('/api/auth', auth_routes);
app.use('/api/create', shortUrl);

import { redirectFromShortUrl } from './controller/shortUrl.controller.js';

app.get('/:id', redirectFromShortUrl);

import { errorHandler } from './utils/errorHandler.js';

app.use(errorHandler);

export default app;
