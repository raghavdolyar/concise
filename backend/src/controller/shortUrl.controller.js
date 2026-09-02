import { getShortUrl } from '../dao/shortUrl.js';
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from '../services/shortUrl.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import APIResponse from '../utils/APIResponse.js';
import APIError from '../utils/APIError.js';

export const createShortUrl = asyncHandler(async (req, res) => {
  const data = req.body;
  let shortUrl;

  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }

  res
    .status(200)
    .json(
      new APIResponse(200, { shortUrl: `${process.env.APP_URL}/${shortUrl}` }),
    );
});

export const redirectFromShortUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);

  if (!url) throw new APIError(404, 'short URL not found');
  res.redirect(url.long_url);
});

export const createCustomShortUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const shortUrl = await createShortUrlWithoutUser(url, customUrl);

  res
    .status(200)
    .json(
      new APIResponse(200, { shortUrl: `${process.env.APP_URL}/${shortUrl}` }),
    );
});
