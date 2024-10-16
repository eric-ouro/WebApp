import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FacilitiesRecord } from '../common/types';

type ValidPartnerFacilitiesState = {
  PartnerFacilities: FacilitiesRecord[];
};

const initialState: ValidPartnerFacilitiesState = {
  PartnerFacilities: [],
};

const validPartnerFacilitiesSlice = createSlice({
  name: 'validPartnerFacilities',
  initialState,
  reducers: {
    setValidPartnerFacilities(state, action: PayloadAction<FacilitiesRecord[]>) {
      state.PartnerFacilities = action.payload;
    },
  },
});

export const { setValidPartnerFacilities } = validPartnerFacilitiesSlice.actions;
export default validPartnerFacilitiesSlice.reducer;