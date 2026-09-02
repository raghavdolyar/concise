import { generateNanoId } from '../utils/helper.js';
import {
  getCustomShortUrl,
  saveShortUrl,
  getShortUrlByLongUrlAndUser,
  getAnonymousShortUrlByLongUrl,
} from '../dao/shortUrl.js';
import APIError from '../utils/APIError.js';

export const createShortUrlWithoutUser = async url => {
  // Anonymous Deduplication check (Global Deduplication)
  const existingUrl = await getAnonymousShortUrlByLongUrl(url);
  if (existingUrl) {
    return existingUrl.short_url;
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const shortUrl = generateNanoId(7);
    if (!shortUrl) throw new APIError(500, 'Short URL not generated');

    try {
      await saveShortUrl(shortUrl, url);
      return shortUrl;
    } catch (err) {
      if (err.statusCode === 409 && attempts < maxAttempts - 1) {
        attempts++;
        continue;
      }
      throw err;
    }
  }
};

export const createShortUrlWithUser = async (url, userId, slug = null) => {
  // Deduplication check: if no custom slug, check if they already shortened this URL
  if (!slug) {
    const existingUrl = await getShortUrlByLongUrlAndUser(url, userId);
    if (existingUrl) {
      return existingUrl.short_url;
    }
  }

  if (slug) {
    const exists = await getCustomShortUrl(slug);
    if (exists) throw new APIError(409, 'This custom url already exists');
    await saveShortUrl(slug, url, userId);
    return slug;
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const shortUrl = generateNanoId(7);
    if (!shortUrl) throw new APIError(500, 'Short URL not generated');

    try {
      await saveShortUrl(shortUrl, url, userId);
      return shortUrl;
    } catch (err) {
      if (err.statusCode === 409 && attempts < maxAttempts - 1) {
        attempts++;
        continue;
      }
      throw err;
    }
  }
};
