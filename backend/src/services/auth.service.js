import User from '../models/user.model.js';
import { signToken } from '../utils/helper.js';
import APIError from '../utils/APIError.js';

export const registerUserAuth = async (name, email, password) => {
  const user = await User.findOne({ $or: [{ email }, { name }] });
  if (user) {
    if (user.email === email)
      throw new APIError(409, 'User with this email already exists');
    if (user.name === name)
      throw new APIError(409, 'Username is already taken');
  }

  const newUser = await User.create({ name, email, password });
  const token = signToken({ id: newUser._id });

  return { token, user: newUser };
};

export const loginUserAuth = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new APIError(401, 'Invalid email or password');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new APIError(401, 'Invalid email or password');

  const token = signToken({ id: user._id });

  // remove password before returning
  user.password = undefined;

  return { token, user };
};
