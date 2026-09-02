import { createSlice } from '@reduxjs/toolkit';

let savedUser = null;
try {
  const userStr = localStorage.getItem('user');
  if (userStr && userStr !== 'undefined') {
    savedUser = JSON.parse(userStr);
  }
} catch (e) {
  savedUser = null;
}

const initialState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
