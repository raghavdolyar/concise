import asyncHandler from '../utils/asyncHandler.js';
import { getAllUserUrlsDao, deleteUserUrlDao } from '../dao/user.dao.js';
import APIResponse from '../utils/APIResponse.js';
import APIError from '../utils/APIError.js';

export const getAllUserUrls = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const urls = await getAllUserUrlsDao(_id);
  res.status(200).json(new APIResponse(200, urls, 'success'));
});

export const deleteUserUrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const deletedUrl = await deleteUserUrlDao(id, _id);
  if (!deletedUrl) {
    throw new APIError(404, 'URL not found or unauthorized');
  }
  res.status(200).json(new APIResponse(200, null, 'URL deleted successfully'));
});
