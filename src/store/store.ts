import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import careerReducer from './careerSlice';
import userReducer from './userSlice'; // Import the new reducer

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    career: careerReducer,
    user: userReducer, // Add the new reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;