import User from '../models/user.model.js';
import Url from '../models/url.model.js';

export const findUserByEmail = async email => {
  return await User.findOne({ email });
};

export const findUserByEmailByPassword = async email => {
  return await User.findOne({ email }).select('+password');
};

export const findUserById = async id => {
  return await User.findById(id);
};

export const createUser = async (name, email, password) => {
  const newUser = new User({ name, email, password });
  await newUser.save();
  return newUser;
};

export const getAllUserUrlsDao = async id => {
  return await Url.find({ user: id });
};

export const deleteUserUrlDao = async (urlId, userId) => {
  return await Url.findOneAndDelete({ _id: urlId, user: userId });
};
