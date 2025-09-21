import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockCareers } from '../assets/mockData';

export interface CareerState {
  careers: typeof mockCareers;
}

const initialState: CareerState = {
  careers: mockCareers,
};

const careerSlice = createSlice({
  name: 'career',
  initialState,
  reducers: {
    setCareers: (state, action: PayloadAction<typeof mockCareers>) => {
      state.careers = action.payload;
    },
  },
});

export const { setCareers } = careerSlice.actions;
export default careerSlice.reducer;