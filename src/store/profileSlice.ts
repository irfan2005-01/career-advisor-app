import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockProfile } from '../assets/mockData';

export interface ProfileState {
  profile: typeof mockProfile | null;
}

const initialState: ProfileState = {
  profile: mockProfile,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<typeof mockProfile>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;