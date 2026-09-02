import { findUserById } from '../dao/user.dao.js';
import { verifyToken } from '../utils/helper.js';
import APIError from '../utils/APIError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) throw new APIError(401, 'Unauthorized');

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded);
    if (!user) throw new APIError(401, 'Unauthorized');
    req.user = user;
    next();
  } catch (error) {
    throw new APIError(401, 'Unauthorized');
  }
});
