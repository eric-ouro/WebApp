import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FacilitiesRecord } from '../common/types';

type ValidFacilitiesState = {
  Facilities: FacilitiesRecord[];
};

const initialState: ValidFacilitiesState = {
  Facilities: [],
};

const validFacilitiesSlice = createSlice({
  name: 'validFacilities',
  initialState,
  reducers: {
    setValidFacilities(state, action: PayloadAction<FacilitiesRecord[]>) {
      state.Facilities = action.payload;
    },
  },
});

export const { setValidFacilities } = validFacilitiesSlice.actions;
export default validFacilitiesSlice.reducer;