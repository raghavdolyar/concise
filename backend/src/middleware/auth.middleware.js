import APIError from '../utils/APIError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  // if attachUser failed to find a valid token/user, req.user will be undefined.
  if (!req.user) {
    throw new APIError(401, 'unauthorized');
  }

  next();
});
