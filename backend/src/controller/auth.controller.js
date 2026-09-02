import { cookieOptions } from '../config/config.js';
import { loginUserAuth, registerUserAuth } from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import APIResponse from '../utils/APIResponse.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await registerUserAuth(name, email, password);

  req.user = user;
  res.cookie('accessToken', token, cookieOptions);
  res.status(200).json(new APIResponse(200, null, 'register success'));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginUserAuth(email, password);

  req.user = user;
  res.cookie('accessToken', token, cookieOptions);
  res.status(200).json(new APIResponse(200, user, 'login success'));
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', cookieOptions);
  res.status(200).json(new APIResponse(200, null, 'logout success'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new APIResponse(200, req.user, 'success'));
});
