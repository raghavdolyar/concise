import asyncHandler from '../utils/asyncHandler.js';
import {
  getAllUserUrls as fetchAllUserUrls,
  deleteUserUrl as removeUserUrl,
} from '../dao/user.dao.js';
import APIResponse from '../utils/APIResponse.js';
import APIError from '../utils/APIError.js';

export const getAllUserUrls = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const urls = await fetchAllUserUrls(_id);
  res.status(200).json(new APIResponse(200, urls, 'success'));
});

export const deleteUserUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const deletedUrl = await removeUserUrl(id, _id);

  if (!deletedUrl) {
    throw new APIError(404, 'URL not found or unauthorized');
  }

  res.status(200).json(new APIResponse(200, null, 'URL deleted successfully'));
});
