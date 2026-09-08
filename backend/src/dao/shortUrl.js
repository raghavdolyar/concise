import APIError from '../utils/APIError.js';
import Url from '../models/url.model.js';

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  try {
    const newUrl = new Url({
      long_url: longUrl,
      short_url: shortUrl,
    });

    if (userId) {
      newUrl.user = userId;
    }

    await newUrl.save();
  } catch (err) {
    if (err.code == 11000) {
      throw new APIError(409, 'short URL already exists');
    }

    throw new APIError(500, err.message);
  }
};

export const getShortUrl = async shortUrl => {
  return await Url.findOneAndUpdate(
    { short_url: shortUrl },
    { $inc: { clicks: 1 } },
  );
};

export const getCustomShortUrl = async slug => {
  return await Url.findOne({ short_url: slug }).lean();
};

export const getShortUrlByLongUrlAndUser = async (longUrl, userId) => {
  return await Url.findOne({ long_url: longUrl, user: userId }).lean();
};

export const getAnonymousShortUrlByLongUrl = async longUrl => {
  // find a URL that matches the long_url and does NOT have a user associated with it
  return await Url.findOne({
    long_url: longUrl,
    user: null,
  }).lean();
};
