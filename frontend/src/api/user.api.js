import axiosInstance from '../utils/axiosInstance';

export const loginUser = async (password, email) => {
  const { data } = await axiosInstance.post('/api/auth/login', {
    email,
    password,
  });
  return { user: data.data, message: data.message };
};

export const registerUser = async (name, password, email) => {
  const { data } = await axiosInstance.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return { user: data.data, message: data.message };
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post('/api/auth/logout');
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get('/api/auth/me');
  return { user: data.data };
};

export const getAllUserUrls = async () => {
  const { data } = await axiosInstance.post('/api/user/urls');
  return { message: data.message, urls: data.data };
};

export const deleteUserUrl = async id => {
  const { data } = await axiosInstance.delete(`/api/user/urls/${id}`);
  return { message: data.message };
};
